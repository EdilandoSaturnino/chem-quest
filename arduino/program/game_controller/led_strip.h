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
  void showLiquidInHoses(
      const Config::RgbColor& leftColor,
      const Config::RgbColor& rightColor,
      uint8_t position);
  void clearMiddle();
  void showMixing(const Config::RgbColor& middleColor, bool enabled);
  void showResult(bool successful);

 private:
  void showSolid(Adafruit_NeoPixel& strip, const Config::RgbColor& color);
  void showFill(
      Adafruit_NeoPixel& strip,
      const Config::RgbColor& color,
      uint8_t filledLedCount);
  void clearStrip(Adafruit_NeoPixel& strip);

  Adafruit_NeoPixel leftPixels_;
  Adafruit_NeoPixel middlePixels_;
  Adafruit_NeoPixel rightPixels_;
  Adafruit_NeoPixel leftHosePixels_;
  Adafruit_NeoPixel rightHosePixels_;
  uint8_t displayedLoadingPosition_ = Config::kMiddleLedCount;
  Config::RgbColor displayedLoadingColor_ = {0, 0, 0};
  uint8_t displayedHosePosition_ = Config::kHoseLedCount;
  Config::RgbColor displayedLeftHoseColor_ = {0, 0, 0};
  Config::RgbColor displayedRightHoseColor_ = {0, 0, 0};
};
