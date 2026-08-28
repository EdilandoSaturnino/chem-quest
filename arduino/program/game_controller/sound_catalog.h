#pragma once

#include <Arduino.h>

enum class SoundId : uint8_t {
  FreeModeIntro,
  PourReagents,
  StartMixing,
  Success,
  Failure,
  Bubbles,
  AirFlow,
};

struct SoundDefinition {
  SoundId id;
  uint16_t trackNumber;
  const char* protocolName;
};

constexpr SoundDefinition kFreeModeIntroSound = {
    SoundId::FreeModeIntro,
    1,
    "FREE_MODE_INTRO",
};

constexpr SoundDefinition kPourReagentsSound = {
    SoundId::PourReagents,
    2,
    "POUR_REAGENTS",
};

constexpr SoundDefinition kStartMixingSound = {
    SoundId::StartMixing,
    3,
    "START_MIXING",
};

constexpr SoundDefinition kSuccessSound = {
    SoundId::Success,
    4,
    "SUCCESS",
};

constexpr SoundDefinition kFailureSound = {
    SoundId::Failure,
    5,
    "FAILURE",
};

constexpr SoundDefinition kBubblesSound = {
    SoundId::Bubbles,
    6,
    "BUBBLES",
};

constexpr SoundDefinition kAirFlowSound = {
    SoundId::AirFlow,
    7,
    "AIR_FLOW",
};

inline const SoundDefinition& soundDefinition(SoundId id) {
  switch (id) {
    case SoundId::FreeModeIntro:
      return kFreeModeIntroSound;
    case SoundId::PourReagents:
      return kPourReagentsSound;
    case SoundId::StartMixing:
      return kStartMixingSound;
    case SoundId::Success:
      return kSuccessSound;
    case SoundId::Failure:
      return kFailureSound;
    case SoundId::Bubbles:
      return kBubblesSound;
    case SoundId::AirFlow:
      return kAirFlowSound;
  }

  return kFreeModeIntroSound;
}
