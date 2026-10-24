#include "led_strip.h"

LedStrip::LedStrip()
    : leftPixels_(Config::kLeftLedCount, Config::kLeftLedDataPin, NEO_GRB + NEO_KHZ800),
      middlePixels_(Config::kMiddleLedCount, Config::kMiddleLedDataPin, NEO_GRB + NEO_KHZ800),
      rightPixels_(Config::kRightLedCount, Config::kRightLedDataPin, NEO_GRB + NEO_KHZ800),
      leftHosePixels_(Config::kHoseLedCount, Config::kLeftHoseLedDataPin, NEO_GRB + NEO_KHZ800),
      rightHosePixels_(Config::kHoseLedCount, Config::kRightHoseLedDataPin, NEO_GRB + NEO_KHZ800) {}

void LedStrip::begin() {
  leftPixels_.begin();
  middlePixels_.begin();
  rightPixels_.begin();
  leftHosePixels_.begin();
  rightHosePixels_.begin();
  clear();
}

void LedStrip::clear() {
  clearStrip(leftPixels_);
  clearStrip(middlePixels_);
  clearStrip(rightPixels_);
  clearStrip(leftHosePixels_);
  clearStrip(rightHosePixels_);
  displayedLoadingPosition_ = Config::kMiddleLedCount;
  displayedHosePosition_ = Config::kHoseLedCount;
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

void LedStrip::showLiquidInHoses(
    const Config::RgbColor& leftColor,
    const Config::RgbColor& rightColor,
    uint8_t position) {
  const uint8_t filledLedCount = min(position, Config::kHoseLedCount);
  if (displayedHosePosition_ == filledLedCount &&
      displayedLeftHoseColor_.red == leftColor.red &&
      displayedLeftHoseColor_.green == leftColor.green &&
      displayedLeftHoseColor_.blue == leftColor.blue &&
      displayedRightHoseColor_.red == rightColor.red &&
      displayedRightHoseColor_.green == rightColor.green &&
      displayedRightHoseColor_.blue == rightColor.blue) {
    return;
  }

  showFill(leftHosePixels_, leftColor, filledLedCount);
  showFill(rightHosePixels_, rightColor, filledLedCount);
  displayedHosePosition_ = filledLedCount;
  displayedLeftHoseColor_ = leftColor;
  displayedRightHoseColor_ = rightColor;
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

void LedStrip::showFill(
    Adafruit_NeoPixel& strip,
    const Config::RgbColor& color,
    uint8_t filledLedCount) {
  strip.clear();
  const uint32_t liquidColor = strip.Color(color.red, color.green, color.blue);
  for (uint8_t index = 0; index < filledLedCount; ++index) {
    strip.setPixelColor(index, liquidColor);
  }
  strip.show();
}

void LedStrip::clearStrip(Adafruit_NeoPixel& strip) {
  strip.clear();
  strip.show();
}
