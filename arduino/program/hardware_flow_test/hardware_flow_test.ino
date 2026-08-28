#include "actuators.h"
#include "config.h"
#include "flow_controller.h"
#include "led_strip.h"
#include "mp3_player.h"

Actuators actuators;
LedStrip ledStrip;
Mp3Player mp3Player;
FlowController flowController(actuators, ledStrip, mp3Player);

void setup() {
  Serial.begin(Config::kDebugBaudRate);

  // Establish a safe output state before starting any peripheral or test phase.
  actuators.begin();
  ledStrip.begin();
  flowController.begin();
}

void loop() {
  flowController.update();
}
