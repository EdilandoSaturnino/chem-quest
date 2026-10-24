#include "serial_protocol.h"

#include <Arduino.h>
#include <stdlib.h>
#include <string.h>

void SerialProtocol::update() {
  while (Serial.available()) {
    const char value = static_cast<char>(Serial.read());
    if (value == '\r') continue;

    if (value == '\n') {
      if (bufferLength_ > 0) {
        buffer_[bufferLength_] = '\0';
        hasCommand_ = true;
      }
      return;
    }

    if (bufferLength_ >= Config::kSerialCommandBufferSize - 1) {
      bufferLength_ = 0;
      hasCommand_ = false;
      continue;
    }

    buffer_[bufferLength_++] = value;
  }
}

bool SerialProtocol::takeCommand(SerialCommand& command) {
  if (!hasCommand_) return false;

  hasCommand_ = false;
  const bool parsed = parseBufferedCommand(command);
  bufferLength_ = 0;
  return parsed;
}

void SerialProtocol::sendPong(bool ready) {
  Serial.println(ready ? F("PONG READY") : F("PONG BOOTING"));
}

void SerialProtocol::sendOk(const __FlashStringHelper* message) {
  Serial.print(F("OK "));
  Serial.println(message);
}

void SerialProtocol::sendError(const __FlashStringHelper* message) {
  Serial.print(F("ERROR "));
  Serial.println(message);
}

void SerialProtocol::sendFlowPumping() {
  Serial.println(F("FLOW PUMPING"));
}

void SerialProtocol::sendFlowMisting() {
  Serial.println(F("FLOW MISTING"));
}

void SerialProtocol::sendFlowDone() {
  Serial.println(F("FLOW DONE"));
}

void SerialProtocol::sendFlowAborted() {
  Serial.println(F("FLOW ABORTED"));
}

bool SerialProtocol::parseBufferedCommand(SerialCommand& command) {
  if (strcmp(buffer_, "PING") == 0) {
    command.type = CommandType::Ping;
    return true;
  }
  if (strcmp(buffer_, "ENTER_FREE_MODE") == 0) {
    command.type = CommandType::EnterFreeMode;
    return true;
  }
  if (strcmp(buffer_, "OFF") == 0) {
    command.type = CommandType::Off;
    return true;
  }
  if (parseBottleColors(buffer_, "PREVIEW", command.colors)) {
    command.type = CommandType::Preview;
    return true;
  }
  if (parseMix(buffer_, command)) {
    command.type = CommandType::Mix;
    return true;
  }

  command.type = CommandType::Invalid;
  return true;
}

bool SerialProtocol::parseBottleColors(
    char* input,
    const char* action,
    Config::BottleColors& colors) {
  const size_t actionLength = strlen(action);
  if (strncmp(input, action, actionLength) != 0 || input[actionLength] != ' ') return false;

  char* cursor = input + actionLength + 1;
  if (!parseColor(cursor, colors.left)) return false;
  if (!parseColor(cursor, colors.right)) return false;
  if (!parseColor(cursor, colors.middle)) return false;
  return *cursor == '\0';
}

bool SerialProtocol::parseMix(char* input, SerialCommand& command) {
  if (!parseBottleColors(input, "MIX", command.colors)) {
    const size_t actionLength = strlen("MIX");
    if (strncmp(input, "MIX", actionLength) != 0 || input[actionLength] != ' ') return false;

    char* cursor = input + actionLength + 1;
    if (!parseColor(cursor, command.colors.left)) return false;
    if (!parseColor(cursor, command.colors.right)) return false;
    if (!parseColor(cursor, command.colors.middle)) return false;

    if (strcmp(cursor, "SUCCESS") == 0) {
      command.outcome = Config::MixOutcome::Success;
      return true;
    }
    if (strcmp(cursor, "FAIL") == 0) {
      command.outcome = Config::MixOutcome::Failure;
      return true;
    }
  }

  return false;
}

bool SerialProtocol::parseColor(char*& cursor, Config::RgbColor& color) {
  char* end = nullptr;
  const long red = strtol(cursor, &end, 10);
  if (end == cursor || *end != ' ') return false;
  cursor = end + 1;

  const long green = strtol(cursor, &end, 10);
  if (end == cursor || *end != ' ') return false;
  cursor = end + 1;

  const long blue = strtol(cursor, &end, 10);
  if (end == cursor) return false;
  cursor = end;
  if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) return false;

  color = {static_cast<uint8_t>(red), static_cast<uint8_t>(green), static_cast<uint8_t>(blue)};
  while (*cursor == ' ') ++cursor;
  return true;
}
