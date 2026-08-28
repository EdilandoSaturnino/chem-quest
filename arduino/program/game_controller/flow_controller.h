#pragma once

#include "actuators.h"
#include "config.h"
#include "led_strip.h"
#include "mp3_player.h"
#include "sound_catalog.h"

enum class FlowEventType {
  None,
  Pumping,
  Announcing,
  Misting,
  Done,
  Aborted,
  Mp3BusyStartError,
  Mp3BusyEndError,
};

struct FlowEvent {
  FlowEventType type = FlowEventType::None;
  SoundId sound = SoundId::FreeModeIntro;
};

class FlowController {
 public:
  FlowController(Actuators& actuators, LedStrip& ledStrip, Mp3Player& mp3Player);

  void begin();
  void update();
  bool ready() const;
  bool enterFreeMode();
  bool start(const Config::BottleColors& colors, Config::MixOutcome outcome);
  bool preview(const Config::BottleColors& colors);
  bool abort();
  FlowEvent takeEvent();

 private:
  enum class Phase {
    WaitingForMp3,
    WaitingBeforeMp3Volume,
    WaitingAfterMp3Volume,
    Idle,
    WaitingForAudioIdleBeforePour,
    WaitingForPourAudio,
    Pumping,
    WaitingForMixingAudio,
    WaitingForMistingAudioStart,
    Misting,
    WaitingForResultAudioStart,
    ResultVisible,
  };

  enum class AudioState {
    Idle,
    WaitingForBusyStart,
    WaitingForBusyEnd,
  };

  enum class AudioEventType {
    None,
    Started,
    Completed,
    BusyStartError,
    BusyEndError,
  };

  void updateAudio();
  bool beginAudio(SoundId sound);
  bool audioCompleted(SoundId sound) const;
  bool audioStarted(SoundId sound) const;
  bool audioIdle() const;
  void enterPhase(Phase nextPhase);
  void setEvent(FlowEventType type, SoundId sound = SoundId::FreeModeIntro);
  bool phaseElapsed(unsigned long durationMs) const;
  bool active() const;
  void failForBusySignal(FlowEventType errorType);
  void finish();

  Actuators& actuators_;
  LedStrip& ledStrip_;
  Mp3Player& mp3Player_;
  Phase phase_ = Phase::WaitingForMp3;
  AudioState audioState_ = AudioState::Idle;
  AudioEventType audioEvent_ = AudioEventType::None;
  SoundId activeAudio_ = SoundId::FreeModeIntro;
  SoundId audioEventSound_ = SoundId::FreeModeIntro;
  unsigned long phaseStartedAt_ = 0;
  unsigned long audioStartedAt_ = 0;
  unsigned long busyLevelChangedAt_ = 0;
  bool sampledBusyPlaying_ = false;
  bool introQueued_ = false;
  Config::BottleColors activeColors_ = {};
  Config::MixOutcome activeOutcome_ = Config::MixOutcome::Failure;
  FlowEvent pendingEvent_;
};
