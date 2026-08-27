#pragma once

#include <Arduino.h>

namespace Config {

struct RgbColor {
  uint8_t red;
  uint8_t green;
  uint8_t blue;
};

constexpr uint8_t kPumpOnePin = 12;
constexpr uint8_t kPumpTwoPin = 10;
constexpr uint8_t kPumpEnabledLevel = HIGH;
constexpr uint8_t kPumpDisabledLevel = LOW;

constexpr uint8_t kMistMakerRelayPin = 7;
constexpr uint8_t kMistMakerEnabledLevel = LOW;
constexpr uint8_t kMistMakerDisabledLevel = HIGH;

constexpr uint8_t kLedDataPin = 2;
constexpr uint8_t kLedCount = 12;

constexpr uint8_t kMp3RxPin = 9;
constexpr uint8_t kMp3TxPin = 8;
constexpr unsigned long kWebSerialBaudRate = 9600UL;
constexpr unsigned long kMp3BaudRate = 9600UL;
constexpr uint8_t kMp3Volume = 30;
constexpr bool kMp3UseAcknowledgement = true;
constexpr bool kMp3ResetOnBegin = false;

constexpr unsigned long kMp3StartupDelayMs = 1500UL;
constexpr unsigned long kMp3CommandGuardMs = 500UL;
constexpr unsigned long kPumpingDurationMs = 5000UL;
constexpr unsigned long kMistingDurationMs = 8000UL;
constexpr unsigned long kMixBlinkHalfPeriodMs = 1000UL;
constexpr unsigned long kLoadingStepIntervalMs = kPumpingDurationMs / kLedCount;

constexpr uint8_t kSerialCommandBufferSize = 48;

static_assert(kLoadingStepIntervalMs > 0, "The loading interval must be positive.");

}  // namespace Config
