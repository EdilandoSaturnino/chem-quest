#include "actuators.h"
#include "config.h"
#include "flow_controller.h"
#include "led_strip.h"
#include "mp3_player.h"
#include "serial_protocol.h"
#include "sound_catalog.h"

Actuators actuators;
LedStrip ledStrip;
Mp3Player mp3Player;
FlowController flowController(actuators, ledStrip, mp3Player);
SerialProtocol serialProtocol;

void handleCommand(const SerialCommand& command) {
  switch (command.type) {
    case CommandType::Ping:
      SerialProtocol::sendPong(flowController.ready());
      return;

    case CommandType::Preview:
      if (!flowController.preview(command.color)) {
        SerialProtocol::sendError(F("BUSY"));
        return;
      }
      SerialProtocol::sendOk(F("PREVIEW"));
      return;

    case CommandType::Mix:
      if (!flowController.start(command.color, SoundId::SynthesisStarted)) {
        SerialProtocol::sendError(F("BUSY"));
      }
      return;

    case CommandType::Off:
      if (flowController.abort()) {
        SerialProtocol::sendFlowAborted();
      }
      SerialProtocol::sendOk(F("OFF"));
      return;

    case CommandType::Invalid:
      SerialProtocol::sendError(F("INVALID_COMMAND"));
      return;

    case CommandType::None:
      return;
  }
}

void publishFlowEvent(const FlowEvent& event) {
  switch (event.type) {
    case FlowEventType::Pumping:
      SerialProtocol::sendFlowPumping();
      return;
    case FlowEventType::Announcing:
      SerialProtocol::sendFlowAnnouncing(soundDefinition(event.sound).protocolName);
      return;
    case FlowEventType::Misting:
      SerialProtocol::sendFlowMisting();
      return;
    case FlowEventType::Done:
      SerialProtocol::sendFlowDone();
      return;
    case FlowEventType::Aborted:
      SerialProtocol::sendFlowAborted();
      return;
    case FlowEventType::None:
      return;
  }
}

void setup() {
  Serial.begin(Config::kWebSerialBaudRate);
  actuators.begin();
  ledStrip.begin();
  flowController.begin();
}

void loop() {
  serialProtocol.update();

  SerialCommand command;
  if (serialProtocol.takeCommand(command)) {
    handleCommand(command);
  }

  flowController.update();
  publishFlowEvent(flowController.takeEvent());
}
