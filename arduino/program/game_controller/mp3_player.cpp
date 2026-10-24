#include "mp3_player.h"

#include <Arduino.h>

namespace {

constexpr uint8_t kRxPin = 9;
constexpr uint8_t kTxPin = 8;
constexpr uint8_t kBusyPin = 2;
constexpr uint8_t kBusyPlayingLevel = LOW;
constexpr unsigned long kBaudRate = 9600UL;
constexpr uint8_t kVolume = 30;
constexpr bool kUseAcknowledgement = true;
constexpr bool kResetOnBegin = false;

}  // namespace

Mp3Player::Mp3Player() : serial_(kRxPin, kTxPin) {}

void Mp3Player::begin() {
  serial_.begin(kBaudRate);
  // BUSY is a 3.3 V output from the MP3-TF-16P. Do not drive it through the
  // Nano's 5 V internal pull-up.
  pinMode(kBusyPin, INPUT);
  player_.begin(serial_, kUseAcknowledgement, kResetOnBegin);
  initialized_ = true;
}

void Mp3Player::update() {
  if (!initialized_) return;

  while (player_.available()) {
    // MP3-TF-16P clones can emit transport timeout or malformed-frame messages
    // despite accepting and playing the command. Consume them without allowing
    // serial diagnostics to interrupt pumps, LEDs, or the mist-maker.
    player_.readType();
    player_.read();
  }
}

void Mp3Player::setVolume() {
  player_.volume(kVolume);
}

void Mp3Player::play(const SoundDefinition& sound) {
  player_.playMp3Folder(sound.trackNumber);
}

bool Mp3Player::isPlaying() const {
  return digitalRead(kBusyPin) == kBusyPlayingLevel;
}
