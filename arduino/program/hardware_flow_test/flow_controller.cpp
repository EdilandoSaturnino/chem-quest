#include "flow_controller.h"

#include <Arduino.h>

#include "config.h"

FlowController::FlowController(Actuators& actuators, LedStrip& ledStrip, Mp3Player& mp3Player)
    : actuators_(actuators), ledStrip_(ledStrip), mp3Player_(mp3Player) {}

void FlowController::begin() {
  actuators_.stopAll();
  ledStrip_.clear();
  enterPhase(Phase::WaitingForMp3);
  Serial.println(F("Waiting for MP3-TF-16P startup."));
}

void FlowController::update() {
  mp3Player_.update();

  switch (phase_) {
    case Phase::WaitingForMp3:
      if (phaseElapsed(Config::kMp3StartupDelayMs)) {
        mp3Player_.begin();
        enterPhase(Phase::WaitingBeforeMp3Volume);
        Serial.println(F("MP3-TF-16P serial transport configured."));
      }
      return;

    case Phase::WaitingBeforeMp3Volume:
      if (phaseElapsed(Config::kMp3CommandGuardMs)) {
        prepareMp3Volume();
      }
      return;

    case Phase::WaitingAfterMp3Volume:
      if (phaseElapsed(Config::kMp3CommandGuardMs)) {
        enterPumping();
      }
      return;

    case Phase::Pumping: {
      const unsigned long elapsedMs = millis() - phaseStartedAt_;
      if (elapsedMs >= Config::kPumpingDurationMs) {
        actuators_.setPumps(false);
        ledStrip_.clear();
        enterAnnouncement();
        return;
      }

      const uint8_t litLedCount = min(
          Config::kLedCount,
          static_cast<uint8_t>(elapsedMs / Config::kLoadingStepIntervalMs + 1));
      ledStrip_.showLoading(litLedCount);
      return;
    }

    case Phase::Announcing:
      if (phaseElapsed(Config::kAnnouncementDurationMs)) {
        enterMixing();
      }
      return;

    case Phase::Mixing: {
      const unsigned long elapsedMs = millis() - phaseStartedAt_;
      if (elapsedMs >= Config::kMixingDurationMs) {
        finish();
        return;
      }

      const bool lightsOn = (elapsedMs / Config::kMixBlinkHalfPeriodMs) % 2 == 0;
      ledStrip_.showMixing(lightsOn);
      return;
    }

    case Phase::Complete:
      return;
  }
}

void FlowController::enterPhase(Phase nextPhase) {
  phase_ = nextPhase;
  phaseStartedAt_ = millis();
}

void FlowController::enterPumping() {
  ledStrip_.clear();
  actuators_.setPumps(true);
  enterPhase(Phase::Pumping);
  Serial.println(F("Pumping started."));
}

void FlowController::prepareMp3Volume() {
  mp3Player_.setVolume();
  enterPhase(Phase::WaitingAfterMp3Volume);
  Serial.println(F("MP3 volume command sent before pumping."));
}

void FlowController::enterAnnouncement() {
  mp3Player_.playAnnouncement();
  enterPhase(Phase::Announcing);
  Serial.println(F("Announcement started with LEDs off."));
}

void FlowController::enterMixing() {
  actuators_.setMistMaker(true);
  ledStrip_.showMixing(true);
  enterPhase(Phase::Mixing);
  Serial.println(F("Mixing and mist-making started."));
}

void FlowController::finish() {
  actuators_.stopAll();
  ledStrip_.clear();
  enterPhase(Phase::Complete);
  Serial.println(F("Hardware flow test complete."));
}

bool FlowController::phaseElapsed(unsigned long durationMs) const {
  return millis() - phaseStartedAt_ >= durationMs;
}
