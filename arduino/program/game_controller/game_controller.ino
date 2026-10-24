#include "actuators.h"
#include "config.h"
#include "flow_controller.h"
#include "led_strip.h"
#include "serial_protocol.h"

Actuators actuators;
LedStrip ledStrip;
FlowController flowController(actuators, ledStrip);
SerialProtocol serialProtocol;

void handleCommand(const SerialCommand& command) {
  switch (command.type) {
    case CommandType::Ping:
      SerialProtocol::sendPong(flowController.ready());
      return;

    case CommandType::EnterFreeMode:
      if (!flowController.enterFreeMode()) {
        SerialProtocol::sendError(F("BUSY"));
        return;
      }
      SerialProtocol::sendOk(F("FREE_MODE"));
      return;

    case CommandType::Preview:
      if (!flowController.preview(command.colors)) {
        SerialProtocol::sendError(F("BUSY"));
        return;
      }
      SerialProtocol::sendOk(F("PREVIEW"));
      return;

    case CommandType::Mix:
      if (!flowController.start(command.colors, command.outcome)) {
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
