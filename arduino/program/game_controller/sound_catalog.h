#pragma once

#include <Arduino.h>

enum class SoundId : uint8_t {
  SynthesisStarted,
};

struct SoundDefinition {
  SoundId id;
  uint16_t trackNumber;
  unsigned long durationMs;
  const char* protocolName;
};

constexpr SoundDefinition kSynthesisStartedSound = {
    SoundId::SynthesisStarted,
    1,
    3000UL,
    "SYNTHESIS_STARTED",
};

inline const SoundDefinition& soundDefinition(SoundId id) {
  switch (id) {
    case SoundId::SynthesisStarted:
      return kSynthesisStartedSound;
  }

  return kSynthesisStartedSound;
}
