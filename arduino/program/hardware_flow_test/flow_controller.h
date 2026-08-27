#pragma once

#include "actuators.h"
#include "led_strip.h"
#include "mp3_player.h"

class FlowController {
 public:
  FlowController(Actuators& actuators, LedStrip& ledStrip, Mp3Player& mp3Player);

  void begin();
  void update();

 private:
  enum class Phase {
    WaitingForMp3,
    WaitingBeforeMp3Volume,
    WaitingAfterMp3Volume,
    Pumping,
    Announcing,
    Mixing,
    Complete,
  };

  void enterPhase(Phase nextPhase);
  void enterPumping();
  void prepareMp3Volume();
  void enterAnnouncement();
  void enterMixing();
  void finish();
  bool phaseElapsed(unsigned long durationMs) const;

  Actuators& actuators_;
  LedStrip& ledStrip_;
  Mp3Player& mp3Player_;
  Phase phase_ = Phase::WaitingForMp3;
  unsigned long phaseStartedAt_ = 0;
};
