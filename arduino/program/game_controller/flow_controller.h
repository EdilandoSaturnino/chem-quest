#pragma once

#include "actuators.h"
#include "config.h"
#include "led_strip.h"

enum class FlowEventType {
  None,
  Pumping,
  Misting,
  Done,
  Aborted,
};

struct FlowEvent {
  FlowEventType type = FlowEventType::None;
};

class FlowController {
 public:
  FlowController(Actuators& actuators, LedStrip& ledStrip);

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
    Idle,
    Pumping,
    Misting,
    ResultVisible,
  };

  void enterPhase(Phase nextPhase);
  void setEvent(FlowEventType type);
  bool phaseElapsed(unsigned long durationMs) const;
  bool active() const;
  void finish();

  Actuators& actuators_;
  LedStrip& ledStrip_;
  Phase phase_ = Phase::Idle;
  unsigned long phaseStartedAt_ = 0;
  Config::BottleColors activeColors_ = {};
  Config::MixOutcome activeOutcome_ = Config::MixOutcome::Failure;
  FlowEvent pendingEvent_;
};
