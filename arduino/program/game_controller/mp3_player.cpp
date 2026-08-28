#include "mp3_player.h"

#include "config.h"

Mp3Player::Mp3Player() : serial_(Config::kMp3RxPin, Config::kMp3TxPin) {}

void Mp3Player::begin() {
  serial_.begin(Config::kMp3BaudRate);
  // BUSY is a 3.3 V output from the MP3-TF-16P. Do not drive it through the
  // Nano's 5 V internal pull-up.
  pinMode(Config::kMp3BusyPin, INPUT);
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

bool Mp3Player::isPlaying() const {
  return digitalRead(Config::kMp3BusyPin) == Config::kMp3BusyPlayingLevel;
}
