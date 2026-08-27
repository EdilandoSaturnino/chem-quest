#include "led_strip.h"

LedStrip::LedStrip()
    : pixels_(Config::kLedCount, Config::kLedDataPin, NEO_GRB + NEO_KHZ800) {}

void LedStrip::begin() {
  pixels_.begin();
  clear();
}

void LedStrip::clear() {
  if (displayState_ == DisplayState::Off) return;

  pixels_.clear();
  pixels_.show();
  displayState_ = DisplayState::Off;
}

void LedStrip::showPreview(const Config::RgbColor& color) {
  if (displayState_ == DisplayState::Preview &&
      displayedColor_.red == color.red &&
      displayedColor_.green == color.green &&
      displayedColor_.blue == color.blue) {
    return;
  }

  showAll(color);
  displayState_ = DisplayState::Preview;
  displayedColor_ = color;
}

void LedStrip::showLoading(const Config::RgbColor& color, uint8_t litLedCount) {
  const uint8_t visibleLedCount = min(litLedCount, Config::kLedCount);
  if (displayState_ == DisplayState::Loading &&
      displayedLoadingCount_ == visibleLedCount &&
      displayedColor_.red == color.red &&
      displayedColor_.green == color.green &&
      displayedColor_.blue == color.blue) {
    return;
  }

  const uint32_t loadingColor = pixels_.Color(color.red, color.green, color.blue);
  for (uint8_t index = 0; index < Config::kLedCount; ++index) {
    pixels_.setPixelColor(index, index < visibleLedCount ? loadingColor : 0);
  }
  pixels_.show();
  displayState_ = DisplayState::Loading;
  displayedLoadingCount_ = visibleLedCount;
  displayedColor_ = color;
}

void LedStrip::showMixing(const Config::RgbColor& color, bool enabled) {
  if (!enabled) {
    clear();
    return;
  }

  if (displayState_ == DisplayState::Mixing &&
      displayedColor_.red == color.red &&
      displayedColor_.green == color.green &&
      displayedColor_.blue == color.blue) {
    return;
  }

  showAll(color);
  displayState_ = DisplayState::Mixing;
  displayedColor_ = color;
}

void LedStrip::showAll(const Config::RgbColor& color) {
  pixels_.fill(pixels_.Color(color.red, color.green, color.blue));
  pixels_.show();
}
