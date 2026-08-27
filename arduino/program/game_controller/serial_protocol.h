#pragma once

#include "config.h"

enum class CommandType {
  None,
  Ping,
  Preview,
  Mix,
  Off,
  Invalid,
};

struct SerialCommand {
  CommandType type = CommandType::None;
  Config::RgbColor color = {0, 0, 0};
};

class SerialProtocol {
 public:
  void update();
  bool takeCommand(SerialCommand& command);

  static void sendPong(bool ready);
  static void sendOk(const __FlashStringHelper* message);
  static void sendError(const __FlashStringHelper* message);
  static void sendFlowPumping();
  static void sendFlowAnnouncing(const char* soundName);
  static void sendFlowMisting();
  static void sendFlowDone();
  static void sendFlowAborted();

 private:
  bool parseBufferedCommand(SerialCommand& command);
  static bool parseColor(const char* input, const char* action, Config::RgbColor& color);

  char buffer_[Config::kSerialCommandBufferSize] = {};
  uint8_t bufferLength_ = 0;
  bool hasCommand_ = false;
};
