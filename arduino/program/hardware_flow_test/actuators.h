#pragma once

class Actuators {
 public:
  void begin();
  void setPumps(bool enabled);
  void setMistMaker(bool enabled);
  void stopAll();

 private:
  static void writePumps(bool enabled);

  bool pumpsEnabled_ = true;
  bool mistMakerEnabled_ = true;
};
