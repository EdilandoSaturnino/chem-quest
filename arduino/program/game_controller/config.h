#pragma once

#include <Arduino.h>

namespace Config {

struct RgbColor {
  uint8_t red;
  uint8_t green;
  uint8_t blue;
};

struct BottleColors {
  RgbColor left;
  RgbColor right;
  RgbColor middle;
};

enum class MixOutcome : uint8_t {
  Success,
  Failure,
};

constexpr uint8_t kMistMakerRelayPin = 7;
constexpr uint8_t kMistMakerEnabledLevel = LOW;
constexpr uint8_t kMistMakerDisabledLevel = HIGH;

constexpr uint8_t kLeftLedDataPin = 5;
constexpr uint8_t kLeftLedCount = 12;
constexpr uint8_t kMiddleLedDataPin = 6;
constexpr uint8_t kMiddleLedCount = 12;
constexpr uint8_t kRightLedDataPin = 4;
constexpr uint8_t kRightLedCount = 7;

// Two 32-pixel WS2812 strips replace the physical pump hoses. They fill from
// their last LED towards their first LED to simulate liquid travelling through them.
constexpr uint8_t kLeftHoseLedDataPin = 3;
constexpr uint8_t kRightHoseLedDataPin = 2;
constexpr uint8_t kHoseLedCount = 32;
constexpr uint8_t kLoadingSegmentLedCount = 3;
constexpr unsigned long kLoadingStepIntervalMs = 125UL;

constexpr unsigned long kWebSerialBaudRate = 9600UL;

constexpr unsigned long kLiquidFlowDurationMs = 3000UL;
constexpr unsigned long kMistingDurationMs = 5000UL;
constexpr unsigned long kMixBlinkHalfPeriodMs = 1000UL;
constexpr RgbColor kOffColor = {0, 0, 0};
constexpr RgbColor kSuccessColor = {0, 255, 0};
constexpr RgbColor kFailureColor = {255, 0, 0};

constexpr uint8_t kSerialCommandBufferSize = 64;

static_assert(kLoadingSegmentLedCount <= kMiddleLedCount, "The loading segment must fit the middle strip.");
}  // namespace Config
