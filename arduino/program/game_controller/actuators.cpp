#include "actuators.h"

#include <Arduino.h>

#include "config.h"

void Actuators::begin() {
  digitalWrite(Config::kMistMakerRelayPin, Config::kMistMakerDisabledLevel);
  pinMode(Config::kMistMakerRelayPin, OUTPUT);

  mistMakerEnabled_ = true;
  stopAll();
}

void Actuators::setMistMaker(bool enabled) {
  if (mistMakerEnabled_ == enabled) return;

  digitalWrite(
      Config::kMistMakerRelayPin,
      enabled ? Config::kMistMakerEnabledLevel : Config::kMistMakerDisabledLevel);
  mistMakerEnabled_ = enabled;
}

void Actuators::stopAll() {
  setMistMaker(false);
}
