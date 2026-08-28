#pragma once

#include <Adafruit_NeoPixel.h>

#include "config.h"

class LedStrip {
 public:
  LedStrip();

  void begin();
  void clear();
  void showPreview(const Config::BottleColors& colors);
  void showLoading(const Config::RgbColor& middleColor, uint8_t position);
  void showSideLoading(
      const Config::RgbColor& leftColor,
      uint8_t leftLitLedCount,
      const Config::RgbColor& rightColor,
      uint8_t rightLitLedCount);
  void clearMiddle();
  void showMixing(const Config::RgbColor& middleColor, bool enabled);
  void showResult(bool successful);

 private:
  void showSolid(Adafruit_NeoPixel& strip, const Config::RgbColor& color);
  void showBottomToTop(
      Adafruit_NeoPixel& strip,
      const Config::RgbColor& color,
      uint8_t litLedCount);
  void clearStrip(Adafruit_NeoPixel& strip);

  Adafruit_NeoPixel leftPixels_;
  Adafruit_NeoPixel middlePixels_;
  Adafruit_NeoPixel rightPixels_;
  uint8_t displayedLoadingPosition_ = Config::kMiddleLedCount;
  Config::RgbColor displayedLoadingColor_ = {0, 0, 0};
};
