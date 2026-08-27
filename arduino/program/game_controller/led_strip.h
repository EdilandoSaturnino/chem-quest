#pragma once

#include <Adafruit_NeoPixel.h>

#include "config.h"

class LedStrip {
 public:
  LedStrip();

  void begin();
  void clear();
  void showPreview(const Config::RgbColor& color);
  void showLoading(const Config::RgbColor& color, uint8_t litLedCount);
  void showMixing(const Config::RgbColor& color, bool enabled);

 private:
  enum class DisplayState {
    Unknown,
    Off,
    Preview,
    Loading,
    Mixing,
  };

  void showAll(const Config::RgbColor& color);

  Adafruit_NeoPixel pixels_;
  DisplayState displayState_ = DisplayState::Unknown;
  uint8_t displayedLoadingCount_ = 0;
  Config::RgbColor displayedColor_ = {0, 0, 0};
};
