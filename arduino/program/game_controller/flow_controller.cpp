#include "flow_controller.h"

#include <Arduino.h>

FlowController::FlowController(Actuators& actuators, LedStrip& ledStrip)
    : actuators_(actuators), ledStrip_(ledStrip) {}

void FlowController::begin() {
  actuators_.stopAll();
  ledStrip_.clear();
    (Phase::Idle);
}

void FlowController::update() {
  switch (phase_) {
    case Phase::Idle:
    case Phase::ResultVisible:
      return;

    case Phase::Pumping: {
      const unsigned long elapsedMs = millis() - phaseStartedAt_;
      if (phaseElapsed(Config::kPumpDurationMs)) {
        actuators_.setPumps(false);
        ledStrip_.clear();
        actuators_.setMistMaker(true);
        ledStrip_.showMixing(activeColors_.middle, true);
        enterPhase(Phase::Misting);
        setEvent(FlowEventType::Misting);
        return;
      }

      const uint8_t position = static_cast<uint8_t>(
          (elapsedMs / Config::kLoadingStepIntervalMs) % Config::kMiddleLedCount);
      ledStrip_.showLoading(activeColors_.middle, position);
      const uint8_t leftLitLedCount = min(
          Config::kLeftLedCount,
          static_cast<uint8_t>(
              elapsedMs * Config::kLeftLedCount / Config::kSideBottleLoadingFillDurationMs + 1));
      const uint8_t rightLitLedCount = min(
          Config::kRightLedCount,
          static_cast<uint8_t>(
              elapsedMs * Config::kRightLedCount / Config::kSideBottleLoadingFillDurationMs + 1));
      ledStrip_.showSideLoading(
          activeColors_.left,
          leftLitLedCount,
          activeColors_.right,
          rightLitLedCount);
      return;
    }

    case Phase::Misting: {
      const unsigned long elapsedMs = millis() - phaseStartedAt_;
      if (phaseElapsed(Config::kMistingDurationMs)) {
        actuators_.setMistMaker(false);
        ledStrip_.showResult(activeOutcome_ == Config::MixOutcome::Success);
        finish();
        return;
      }

      const bool lightsOn = (elapsedMs / Config::kMixBlinkHalfPeriodMs) % 2 == 0;
      ledStrip_.showMixing(activeColors_.middle, lightsOn);
      return;
    }
  }
}

bool FlowController::ready() const {
  return phase_ == Phase::Idle;
}

bool FlowController::enterFreeMode() {
  return true;
}

bool FlowController::start(const Config::BottleColors& colors, Config::MixOutcome outcome) {
  if (!ready()) return false;

  activeColors_ = colors;
  activeOutcome_ = outcome;
  Config::BottleColors displayColors = colors;
  displayColors.middle = Config::kOffColor;
  ledStrip_.showPreview(displayColors);
  actuators_.setPumps(true);
  enterPhase(Phase::Pumping);
  setEvent(FlowEventType::Pumping);
  return true;
}

bool FlowController::preview(const Config::BottleColors& colors) {
  if (!ready()) return false;

  ledStrip_.showPreview(colors);
  return true;
}

bool FlowController::abort() {
  const bool wasActive = active();
  actuators_.stopAll();
  ledStrip_.clear();
  if (!wasActive && phase_ != Phase::ResultVisible) return false;

  enterPhase(Phase::Idle);
  if (wasActive) setEvent(FlowEventType::Aborted);
  return wasActive;
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

void FlowController::setEvent(FlowEventType type) {
  pendingEvent_.type = type;
}

bool FlowController::phaseElapsed(unsigned long durationMs) const {
  return millis() - phaseStartedAt_ >= durationMs;
}

bool FlowController::active() const {
  return phase_ == Phase::Pumping || phase_ == Phase::Misting;
}

void FlowController::finish() {
  actuators_.stopAll();
  enterPhase(Phase::ResultVisible);
  setEvent(FlowEventType::Done);
}
