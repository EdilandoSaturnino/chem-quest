#pragma once

#include <DFRobotDFPlayerMini.h>
#include <SoftwareSerial.h>

#include "sound_catalog.h"

class Mp3Player {
 public:
  Mp3Player();

  void begin();
  void update();
  void setVolume();
  void play(const SoundDefinition& sound);

 private:
  SoftwareSerial serial_;
  DFRobotDFPlayerMini player_;
  bool initialized_ = false;
};
