#include "actuators.h"

#include <Arduino.h>

#include "config.h"

void Actuators::begin() {
  pinMode(Config::kPumpOnePin, OUTPUT);
  pinMode(Config::kPumpTwoPin, OUTPUT);
  digitalWrite(Config::kMistMakerRelayPin, Config::kMistMakerDisabledLevel);
  pinMode(Config::kMistMakerRelayPin, OUTPUT);

  pumpsEnabled_ = true;
  mistMakerEnabled_ = true;
  stopAll();
}

void Actuators::setPumps(bool enabled) {
  if (pumpsEnabled_ == enabled) return;

  writePumps(enabled);
  pumpsEnabled_ = enabled;
}

void Actuators::setMistMaker(bool enabled) {
  if (mistMakerEnabled_ == enabled) return;

  digitalWrite(
      Config::kMistMakerRelayPin,
      enabled ? Config::kMistMakerEnabledLevel : Config::kMistMakerDisabledLevel);
  mistMakerEnabled_ = enabled;
}

void Actuators::stopAll() {
  setPumps(false);
  setMistMaker(false);
}

void Actuators::writePumps(bool enabled) {
  const uint8_t outputLevel = enabled ? Config::kPumpEnabledLevel : Config::kPumpDisabledLevel;
  digitalWrite(Config::kPumpOnePin, outputLevel);
  digitalWrite(Config::kPumpTwoPin, outputLevel);
}
