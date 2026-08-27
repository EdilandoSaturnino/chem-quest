#pragma once

#include <Adafruit_NeoPixel.h>

#include "config.h"

class LedStrip {
 public:
  LedStrip();

  void begin();
  void clear();
  void showLoading(uint8_t litLedCount);
  void showMixing(bool enabled);

 private:
  void showAll(const Config::RgbColor& color);

  enum class DisplayState {
    Unknown,
    Off,
    Loading,
    Mixing,
  };

  Adafruit_NeoPixel pixels_;
  DisplayState displayState_ = DisplayState::Unknown;
  uint8_t displayedLoadingCount_ = 0;
};
