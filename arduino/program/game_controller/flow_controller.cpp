#include "flow_controller.h"

#include <Arduino.h>

FlowController::FlowController(Actuators& actuators, LedStrip& ledStrip, Mp3Player& mp3Player)
    : actuators_(actuators), ledStrip_(ledStrip), mp3Player_(mp3Player) {}

void FlowController::begin() {
  actuators_.stopAll();
  ledStrip_.clear();
  enterPhase(Phase::WaitingForMp3);
}

void FlowController::update() {
  mp3Player_.update();

  switch (phase_) {
    case Phase::WaitingForMp3:
      if (phaseElapsed(Config::kMp3StartupDelayMs)) {
        mp3Player_.begin();
        enterPhase(Phase::WaitingBeforeMp3Volume);
      }
      return;

    case Phase::WaitingBeforeMp3Volume:
      if (phaseElapsed(Config::kMp3CommandGuardMs)) {
        mp3Player_.setVolume();
        enterPhase(Phase::WaitingAfterMp3Volume);
      }
      return;

    case Phase::WaitingAfterMp3Volume:
      if (phaseElapsed(Config::kMp3CommandGuardMs)) {
        enterPhase(Phase::Idle);
      }
      return;

    case Phase::Idle:
      return;

    case Phase::Pumping: {
      const unsigned long elapsedMs = millis() - phaseStartedAt_;
      if (elapsedMs >= Config::kPumpingDurationMs) {
        actuators_.setPumps(false);
        ledStrip_.clear();
        mp3Player_.play(soundDefinition(activeSound_));
        enterPhase(Phase::Announcing);
        setEvent(FlowEventType::Announcing);
        return;
      }

      const uint8_t litLedCount = min(
          Config::kLedCount,
          static_cast<uint8_t>(elapsedMs / Config::kLoadingStepIntervalMs + 1));
      ledStrip_.showLoading(activeColor_, litLedCount);
      return;
    }

    case Phase::Announcing:
      if (phaseElapsed(soundDefinition(activeSound_).durationMs)) {
        actuators_.setMistMaker(true);
        ledStrip_.showMixing(activeColor_, true);
        enterPhase(Phase::Misting);
        setEvent(FlowEventType::Misting);
      }
      return;

    case Phase::Misting: {
      const unsigned long elapsedMs = millis() - phaseStartedAt_;
      if (elapsedMs >= Config::kMistingDurationMs) {
        finish();
        return;
      }

      const bool lightsOn = (elapsedMs / Config::kMixBlinkHalfPeriodMs) % 2 == 0;
      ledStrip_.showMixing(activeColor_, lightsOn);
      return;
    }
  }
}

bool FlowController::ready() const {
  return phase_ == Phase::Idle;
}

bool FlowController::start(const Config::RgbColor& color, SoundId sound) {
  if (!ready()) return false;

  activeColor_ = color;
  activeSound_ = sound;
  ledStrip_.clear();
  actuators_.setPumps(true);
  enterPhase(Phase::Pumping);
  setEvent(FlowEventType::Pumping);
  return true;
}

bool FlowController::preview(const Config::RgbColor& color) {
  if (!ready()) return false;

  ledStrip_.showPreview(color);
  return true;
}

bool FlowController::abort() {
  const bool wasActive = active();
  actuators_.stopAll();
  ledStrip_.clear();
  if (!wasActive) return false;

  enterPhase(Phase::Idle);
  setEvent(FlowEventType::Aborted);
  return true;
}

FlowEvent FlowController::takeEvent() {
  const FlowEvent event = pendingEvent_;
  pendingEvent_ = FlowEvent{};
  return event;
}

void FlowController::enterPhase(Phase nextPhase) {
  phase_ = nextPhase;
  phaseStartedAt_ = millis();
}

void FlowController::setEvent(FlowEventType type, uint16_t value) {
  pendingEvent_.type = type;
  pendingEvent_.value = value;
  pendingEvent_.sound = activeSound_;
}

bool FlowController::phaseElapsed(unsigned long durationMs) const {
  return millis() - phaseStartedAt_ >= durationMs;
}

bool FlowController::active() const {
  return phase_ == Phase::Pumping || phase_ == Phase::Announcing || phase_ == Phase::Misting;
}

void FlowController::finish() {
  actuators_.stopAll();
  ledStrip_.clear();
  enterPhase(Phase::Idle);
  setEvent(FlowEventType::Done);
}
