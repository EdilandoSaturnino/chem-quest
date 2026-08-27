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
};

struct FlowEvent {
  FlowEventType type = FlowEventType::None;
  uint16_t value = 0;
  SoundId sound = SoundId::SynthesisStarted;
};

class FlowController {
 public:
  FlowController(Actuators& actuators, LedStrip& ledStrip, Mp3Player& mp3Player);

  void begin();
  void update();
  bool ready() const;
  bool start(const Config::RgbColor& color, SoundId sound);
  bool preview(const Config::RgbColor& color);
  bool abort();
  FlowEvent takeEvent();

 private:
  enum class Phase {
    WaitingForMp3,
    WaitingBeforeMp3Volume,
    WaitingAfterMp3Volume,
    Idle,
    Pumping,
    Announcing,
    Misting,
  };

  void enterPhase(Phase nextPhase);
  void setEvent(FlowEventType type, uint16_t value = 0);
  bool phaseElapsed(unsigned long durationMs) const;
  bool active() const;
  void finish();

  Actuators& actuators_;
  LedStrip& ledStrip_;
  Mp3Player& mp3Player_;
  Phase phase_ = Phase::WaitingForMp3;
  unsigned long phaseStartedAt_ = 0;
  Config::RgbColor activeColor_ = {0, 0, 0};
  SoundId activeSound_ = SoundId::SynthesisStarted;
  FlowEvent pendingEvent_;
};
