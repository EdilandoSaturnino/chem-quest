#pragma once

#include <Arduino.h>

namespace Config {

struct RgbColor {
  uint8_t red;
  uint8_t green;
  uint8_t blue;
};

// Pump outputs. HIGH enables MOSFET driver.
constexpr uint8_t kPumpOnePin = 12;
constexpr uint8_t kPumpTwoPin = 10;
constexpr uint8_t kPumpEnabledLevel = HIGH;
constexpr uint8_t kPumpDisabledLevel = LOW;

// Mist-maker relay. Its IN input is active LOW on D7.
constexpr uint8_t kMistMakerRelayPin = 7;
constexpr uint8_t kMistMakerEnabledLevel = LOW;
constexpr uint8_t kMistMakerDisabledLevel = HIGH;

// WS2812 strip.
constexpr uint8_t kLedDataPin = 2;
constexpr uint8_t kLedCount = 12;
constexpr RgbColor kLoadingColor = {0, 255, 255};
constexpr RgbColor kMixingColor = {0, 255, 255};

// MP3-TF-16P serial wiring: module TX -> Arduino RX (D9), module RX -> Arduino TX (D8).
constexpr uint8_t kMp3RxPin = 9;
constexpr uint8_t kMp3TxPin = 8;
constexpr unsigned long kDebugBaudRate = 115200UL;
constexpr unsigned long kMp3BaudRate = 9600UL;
constexpr uint8_t kMp3Volume = 30;
// This clone accepts command ACKs, but must not receive the library reset during begin().
constexpr bool kMp3UseAcknowledgement = true;
constexpr bool kMp3ResetOnBegin = false;

// The audio file must be stored as /mp3/0001.mp3 on the module SD card.
constexpr uint8_t kAnnouncementTrackNumber = 1;
constexpr unsigned long kMp3StartupDelayMs = 1500UL;
constexpr unsigned long kMp3CommandGuardMs = 500UL;
constexpr unsigned long kAnnouncementDurationMs = 3000UL;

constexpr unsigned long kPumpingDurationMs = 5000UL;
constexpr unsigned long kLoadingStepIntervalMs = kPumpingDurationMs / kLedCount;
constexpr unsigned long kMixingDurationMs = 5000UL;
constexpr unsigned long kMixBlinkHalfPeriodMs = 1000UL;

static_assert(kLoadingStepIntervalMs > 0, "The loading interval must be positive.");

}  // namespace Config
