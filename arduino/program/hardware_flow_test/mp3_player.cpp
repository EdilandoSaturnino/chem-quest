#include "mp3_player.h"

#include <Arduino.h>

#include "config.h"

Mp3Player::Mp3Player() : serial_(Config::kMp3RxPin, Config::kMp3TxPin) {}

void Mp3Player::begin() {
  serial_.begin(Config::kMp3BaudRate);

  // Keep ACK enabled, but skip the reset command that this MP3-TF-16P clone rejects.
  player_.begin(serial_, Config::kMp3UseAcknowledgement, Config::kMp3ResetOnBegin);
  initialized_ = true;
}

void Mp3Player::update() {
  if (!initialized_) return;

  while (player_.available()) {
    const uint8_t messageType = player_.readType();
    const uint16_t messageValue = player_.read();

    switch (messageType) {
      case DFPlayerPlayFinished:
        Serial.print(F("MP3 track finished: "));
        Serial.println(messageValue);
        break;
      case DFPlayerError:
        Serial.print(F("MP3 error: "));
        Serial.println(messageValue);
        break;
      case DFPlayerCardInserted:
      case DFPlayerCardOnline:
        Serial.println(F("MP3 SD card available."));
        break;
      case DFPlayerCardRemoved:
        Serial.println(F("MP3 SD card removed."));
        break;
      default:
        Serial.print(F("MP3 message type: "));
        Serial.println(messageType);
        break;
    }
  }
}

void Mp3Player::setVolume() {
  player_.volume(Config::kMp3Volume);
}

void Mp3Player::playAnnouncement() {
  player_.playMp3Folder(Config::kAnnouncementTrackNumber);
}
