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

constexpr uint8_t kPumpOnePin = 12;
constexpr uint8_t kPumpTwoPin = 10;
constexpr uint8_t kPumpEnabledLevel = HIGH;
constexpr uint8_t kPumpDisabledLevel = LOW;

constexpr uint8_t kMistMakerRelayPin = 7;
constexpr uint8_t kMistMakerEnabledLevel = LOW;
constexpr uint8_t kMistMakerDisabledLevel = HIGH;

constexpr uint8_t kLeftLedDataPin = 6;
constexpr uint8_t kLeftLedCount = 8;
constexpr uint8_t kMiddleLedDataPin = 5;
constexpr uint8_t kMiddleLedCount = 12;
constexpr uint8_t kRightLedDataPin = 4;
constexpr uint8_t kRightLedCount = 7;
constexpr uint8_t kLoadingSegmentLedCount = 3;
constexpr unsigned long kLoadingStepIntervalMs = 125UL;

constexpr uint8_t kMp3BusyPin = 2;
constexpr uint8_t kMp3BusyPlayingLevel = LOW;
constexpr uint8_t kMp3BusyIdleLevel = HIGH;

constexpr uint8_t kMp3RxPin = 9;
constexpr uint8_t kMp3TxPin = 8;
constexpr unsigned long kWebSerialBaudRate = 9600UL;
constexpr unsigned long kMp3BaudRate = 9600UL;
constexpr uint8_t kMp3Volume = 30;
constexpr bool kMp3UseAcknowledgement = true;
constexpr bool kMp3ResetOnBegin = false;

constexpr unsigned long kMp3StartupDelayMs = 1500UL;
constexpr unsigned long kMp3CommandGuardMs = 500UL;
constexpr unsigned long kMp3BusyStartTimeoutMs = 2000UL;
constexpr unsigned long kMp3BusyEndTimeoutMs = 15000UL;
constexpr unsigned long kMp3BusyStartDebounceMs = 50UL;
constexpr unsigned long kMp3BusyEndDebounceMs = 1000UL;
constexpr unsigned long kPumpDurationMs = 5000UL;
constexpr unsigned long kSideBottleLoadingFillDurationMs = 5000UL;
constexpr unsigned long kMixBlinkHalfPeriodMs = 1000UL;
constexpr RgbColor kOffColor = {0, 0, 0};
constexpr RgbColor kSuccessColor = {0, 255, 0};
constexpr RgbColor kFailureColor = {255, 0, 0};

constexpr uint8_t kSerialCommandBufferSize = 64;

static_assert(kLoadingSegmentLedCount <= kMiddleLedCount, "The loading segment must fit the middle strip.");

}  // namespace Config
