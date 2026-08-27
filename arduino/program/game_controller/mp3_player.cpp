#include "mp3_player.h"

#include "config.h"

Mp3Player::Mp3Player() : serial_(Config::kMp3RxPin, Config::kMp3TxPin) {}

void Mp3Player::begin() {
  serial_.begin(Config::kMp3BaudRate);
  player_.begin(serial_, Config::kMp3UseAcknowledgement, Config::kMp3ResetOnBegin);
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
  player_.volume(Config::kMp3Volume);
}

void Mp3Player::play(const SoundDefinition& sound) {
  player_.playMp3Folder(sound.trackNumber);
}
