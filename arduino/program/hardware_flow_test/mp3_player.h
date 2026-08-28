#pragma once

#include <DFRobotDFPlayerMini.h>
#include <SoftwareSerial.h>

class Mp3Player {
 public:
  Mp3Player();

  void begin();
  void update();
  void setVolume();
  void playAnnouncement();

 private:
  SoftwareSerial serial_;
  DFRobotDFPlayerMini player_;
  bool initialized_ = false;
};
