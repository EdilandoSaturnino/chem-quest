#pragma once

#include "config.h"

enum class CommandType {
  None,
  Ping,
  EnterFreeMode,
  Preview,
  Mix,
  Off,
  Invalid,
};

struct SerialCommand {
  CommandType type = CommandType::None;
  Config::BottleColors colors = {};
  Config::MixOutcome outcome = Config::MixOutcome::Failure;
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
  static void sendMp3BusyStartError(const char* soundName);
  static void sendMp3BusyEndError(const char* soundName);

 private:
  bool parseBufferedCommand(SerialCommand& command);
  static bool parseBottleColors(char* input, const char* action, Config::BottleColors& colors);
  static bool parseMix(char* input, SerialCommand& command);
  static bool parseColor(char*& cursor, Config::RgbColor& color);

  char buffer_[Config::kSerialCommandBufferSize] = {};
  uint8_t bufferLength_ = 0;
  bool hasCommand_ = false;
};
