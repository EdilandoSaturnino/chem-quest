#pragma once

class Actuators {
 public:
  void begin();
  void setMistMaker(bool enabled);
  void stopAll();

 private:
  bool mistMakerEnabled_ = true;
};
