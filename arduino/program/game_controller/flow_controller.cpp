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
  updateAudio();

  if (audioEvent_ == AudioEventType::BusyStartError ||
      audioEvent_ == AudioEventType::BusyEndError) {
    const FlowEventType errorType = audioEvent_ == AudioEventType::BusyStartError
        ? FlowEventType::Mp3BusyStartError
        : FlowEventType::Mp3BusyEndError;
    if (active()) {
      failForBusySignal(errorType);
      return;
    }
    if (phase_ == Phase::Idle) {
      setEvent(errorType, audioEventSound_);
    }
  }

  if (audioIdle() && introQueued_ && phase_ == Phase::Idle) {
    introQueued_ = false;
    beginAudio(SoundId::FreeModeIntro);
  }

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
    case Phase::ResultVisible:
      return;

    case Phase::WaitingForAudioIdleBeforePour:
      if (audioIdle()) {
        if (introQueued_) {
          introQueued_ = false;
          beginAudio(SoundId::FreeModeIntro);
          return;
        }
        beginAudio(SoundId::PourReagents);
        enterPhase(Phase::WaitingForPourAudio);
        setEvent(FlowEventType::Announcing, SoundId::PourReagents);
      }
      return;

    case Phase::WaitingForPourAudio:
      if (audioCompleted(SoundId::PourReagents)) {
        actuators_.setPumps(true);
        enterPhase(Phase::Pumping);
        setEvent(FlowEventType::Pumping);
      }
      return;

    case Phase::Pumping: {
      const unsigned long elapsedMs = millis() - phaseStartedAt_;
      if (phaseElapsed(Config::kPumpDurationMs)) {
        actuators_.setPumps(false);
        ledStrip_.clear();
        beginAudio(SoundId::StartMixing);
        enterPhase(Phase::WaitingForMixingAudio);
        setEvent(FlowEventType::Announcing, SoundId::StartMixing);
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

    case Phase::WaitingForMixingAudio:
      if (audioCompleted(SoundId::StartMixing)) {
        beginAudio(SoundId::Bubbles);
        enterPhase(Phase::WaitingForMistingAudioStart);
        setEvent(FlowEventType::Announcing, SoundId::Bubbles);
      }
      return;

    case Phase::WaitingForMistingAudioStart:
      if (audioStarted(SoundId::Bubbles)) {
        actuators_.setMistMaker(true);
        ledStrip_.showMixing(activeColors_.middle, true);
        enterPhase(Phase::Misting);
        setEvent(FlowEventType::Misting);
      }
      return;

    case Phase::Misting: {
      const unsigned long elapsedMs = millis() - phaseStartedAt_;
      if (audioCompleted(SoundId::Bubbles)) {
        actuators_.setMistMaker(false);
        ledStrip_.showResult(activeOutcome_ == Config::MixOutcome::Success);
        beginAudio(activeOutcome_ == Config::MixOutcome::Success ? SoundId::Success : SoundId::Failure);
        enterPhase(Phase::WaitingForResultAudioStart);
        return;
      }

      const bool lightsOn = (elapsedMs / Config::kMixBlinkHalfPeriodMs) % 2 == 0;
      ledStrip_.showMixing(activeColors_.middle, lightsOn);
      return;
    }

    case Phase::WaitingForResultAudioStart:
      if (audioStarted(activeOutcome_ == Config::MixOutcome::Success ? SoundId::Success : SoundId::Failure)) {
        finish();
      }
      return;
  }
}

bool FlowController::ready() const {
  return phase_ == Phase::Idle;
}

bool FlowController::enterFreeMode() {
  if (audioState_ == AudioState::Idle) {
    return beginAudio(SoundId::FreeModeIntro);
  }

  if (activeAudio_ == SoundId::FreeModeIntro) return true;

  introQueued_ = true;
  return true;
}

bool FlowController::start(const Config::BottleColors& colors, Config::MixOutcome outcome) {
  if (!ready()) return false;

  activeColors_ = colors;
  activeOutcome_ = outcome;
  Config::BottleColors displayColors = colors;
  displayColors.middle = Config::kOffColor;
  ledStrip_.showPreview(displayColors);
  enterPhase(Phase::WaitingForAudioIdleBeforePour);
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

void FlowController::updateAudio() {
  audioEvent_ = AudioEventType::None;

  const bool busyPlaying = mp3Player_.isPlaying();
  if (busyPlaying != sampledBusyPlaying_) {
    sampledBusyPlaying_ = busyPlaying;
    busyLevelChangedAt_ = millis();
  }

  switch (audioState_) {
    case AudioState::Idle:
      return;

    case AudioState::WaitingForBusyStart:
      if (sampledBusyPlaying_ &&
          millis() - busyLevelChangedAt_ >= Config::kMp3BusyStartDebounceMs) {
        audioState_ = AudioState::WaitingForBusyEnd;
        audioEvent_ = AudioEventType::Started;
        audioEventSound_ = activeAudio_;
        return;
      }
      if (millis() - audioStartedAt_ >= Config::kMp3BusyStartTimeoutMs) {
        audioState_ = AudioState::Idle;
        audioEvent_ = AudioEventType::BusyStartError;
        audioEventSound_ = activeAudio_;
      }
      return;

    case AudioState::WaitingForBusyEnd:
      if (!sampledBusyPlaying_ &&
          millis() - busyLevelChangedAt_ >= Config::kMp3BusyEndDebounceMs) {
        audioState_ = AudioState::Idle;
        audioEvent_ = AudioEventType::Completed;
        audioEventSound_ = activeAudio_;
        return;
      }
      if (millis() - audioStartedAt_ >= Config::kMp3BusyEndTimeoutMs) {
        audioState_ = AudioState::Idle;
        audioEvent_ = AudioEventType::BusyEndError;
        audioEventSound_ = activeAudio_;
      }
      return;
  }
}

bool FlowController::beginAudio(SoundId sound) {
  if (!audioIdle()) return false;

  activeAudio_ = sound;
  audioStartedAt_ = millis();
  sampledBusyPlaying_ = mp3Player_.isPlaying();
  busyLevelChangedAt_ = audioStartedAt_;
  audioState_ = AudioState::WaitingForBusyStart;
  mp3Player_.play(soundDefinition(sound));
  return true;
}

bool FlowController::audioCompleted(SoundId sound) const {
  return audioEvent_ == AudioEventType::Completed && audioEventSound_ == sound &&
      audioState_ == AudioState::Idle;
}

bool FlowController::audioStarted(SoundId sound) const {
  return audioEvent_ == AudioEventType::Started && audioEventSound_ == sound &&
      audioState_ == AudioState::WaitingForBusyEnd;
}

bool FlowController::audioIdle() const {
  return audioState_ == AudioState::Idle;
}

void FlowController::enterPhase(Phase nextPhase) {
  phase_ = nextPhase;
  phaseStartedAt_ = millis();
}

void FlowController::setEvent(FlowEventType type, SoundId sound) {
  pendingEvent_.type = type;
  pendingEvent_.sound = sound;
}

bool FlowController::phaseElapsed(unsigned long durationMs) const {
  return millis() - phaseStartedAt_ >= durationMs;
}

bool FlowController::active() const {
  return phase_ == Phase::WaitingForAudioIdleBeforePour ||
      phase_ == Phase::WaitingForPourAudio || phase_ == Phase::Pumping ||
      phase_ == Phase::WaitingForMixingAudio ||
      phase_ == Phase::WaitingForMistingAudioStart || phase_ == Phase::Misting ||
      phase_ == Phase::WaitingForResultAudioStart;
}

void FlowController::failForBusySignal(FlowEventType errorType) {
  actuators_.stopAll();
  ledStrip_.clear();
  enterPhase(Phase::Idle);
  setEvent(errorType, audioEventSound_);
}

void FlowController::finish() {
  actuators_.stopAll();
  enterPhase(Phase::ResultVisible);
  setEvent(FlowEventType::Done);
}
