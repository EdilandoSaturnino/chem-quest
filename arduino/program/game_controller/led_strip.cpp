#include "led_strip.h"

LedStrip::LedStrip()
    : leftPixels_(Config::kLeftLedCount, Config::kLeftLedDataPin, NEO_GRB + NEO_KHZ800),
      middlePixels_(Config::kMiddleLedCount, Config::kMiddleLedDataPin, NEO_GRB + NEO_KHZ800),
      rightPixels_(Config::kRightLedCount, Config::kRightLedDataPin, NEO_GRB + NEO_KHZ800) {}

void LedStrip::begin() {
  leftPixels_.begin();
  middlePixels_.begin();
  rightPixels_.begin();
  clear();
}

void LedStrip::clear() {
  clearStrip(leftPixels_);
  clearStrip(middlePixels_);
  clearStrip(rightPixels_);
  displayedLoadingPosition_ = Config::kMiddleLedCount;
}

void LedStrip::showPreview(const Config::BottleColors& colors) {
  showSolid(leftPixels_, colors.left);
  showSolid(middlePixels_, colors.middle);
  showSolid(rightPixels_, colors.right);
  displayedLoadingPosition_ = Config::kMiddleLedCount;
}

void LedStrip::showLoading(const Config::RgbColor& middleColor, uint8_t position) {
  const uint8_t normalizedPosition = position % Config::kMiddleLedCount;
  if (displayedLoadingPosition_ == normalizedPosition &&
      displayedLoadingColor_.red == middleColor.red &&
      displayedLoadingColor_.green == middleColor.green &&
      displayedLoadingColor_.blue == middleColor.blue) {
    return;
  }

  middlePixels_.clear();
  const uint32_t color = middlePixels_.Color(middleColor.red, middleColor.green, middleColor.blue);
  for (uint8_t offset = 0; offset < Config::kLoadingSegmentLedCount; ++offset) {
    const uint8_t index = (normalizedPosition + offset) % Config::kMiddleLedCount;
    middlePixels_.setPixelColor(index, color);
  }
  middlePixels_.show();
  displayedLoadingPosition_ = normalizedPosition;
  displayedLoadingColor_ = middleColor;
}

void LedStrip::showSideLoading(
    const Config::RgbColor& leftColor,
    uint8_t leftLitLedCount,
    const Config::RgbColor& rightColor,
    uint8_t rightLitLedCount) {
  showBottomToTop(leftPixels_, leftColor, leftLitLedCount);
  showBottomToTop(rightPixels_, rightColor, rightLitLedCount);
}

void LedStrip::clearMiddle() {
  clearStrip(middlePixels_);
  displayedLoadingPosition_ = Config::kMiddleLedCount;
}

void LedStrip::showMixing(const Config::RgbColor& middleColor, bool enabled) {
  if (!enabled) {
    clearMiddle();
    return;
  }

  showSolid(middlePixels_, middleColor);
  displayedLoadingPosition_ = Config::kMiddleLedCount;
}

void LedStrip::showResult(bool successful) {
  showSolid(middlePixels_, successful ? Config::kSuccessColor : Config::kFailureColor);
  displayedLoadingPosition_ = Config::kMiddleLedCount;
}

void LedStrip::showSolid(Adafruit_NeoPixel& strip, const Config::RgbColor& color) {
  strip.fill(strip.Color(color.red, color.green, color.blue));
  strip.show();
}

void LedStrip::showBottomToTop(
    Adafruit_NeoPixel& strip,
    const Config::RgbColor& color,
    uint8_t litLedCount) {
  const uint8_t visibleLedCount = min(litLedCount, static_cast<uint8_t>(strip.numPixels()));
  const uint32_t visibleColor = strip.Color(color.red, color.green, color.blue);
  for (uint8_t index = 0; index < strip.numPixels(); ++index) {
    strip.setPixelColor(index, index < visibleLedCount ? visibleColor : 0);
  }
  strip.show();
}

void LedStrip::clearStrip(Adafruit_NeoPixel& strip) {
  strip.clear();
  strip.show();
}
