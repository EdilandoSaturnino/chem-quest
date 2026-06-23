const int redPin = 3;
const int greenPin = 5;
const int bluePin = 6;
const int buzzerPin = 8;

int currentRed = 0;
int currentGreen = 0;
int currentBlue = 0;

void setup() {
  Serial.begin(9600);

  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  turnOff();
}

void loop() {
  if (!Serial.available()) return;

  String command = Serial.readStringUntil('\n');
  command.trim();
  if (command.length() == 0) return;

  handleCommand(command);
}

void handleCommand(String command) {
  if (command == "PING") {
    Serial.println("PONG");
    return;
  }

  if (command == "OFF") {
    turnOff();
    Serial.println("OK OFF");
    return;
  }

  String action = tokenAt(command, 0);

  if (action == "PREVIEW") {
    int r = readIntToken(command, 1, currentRed);
    int g = readIntToken(command, 2, currentGreen);
    int b = readIntToken(command, 3, currentBlue);
    fadeTo(r, g, b, 12, 12);
    Serial.println("OK PREVIEW");
    return;
  }

  if (action == "MIX") {
    int r = readIntToken(command, 1, 180);
    int g = readIntToken(command, 2, 80);
    int b = readIntToken(command, 3, 220);
    int durationMs = readDurationToken(command, 4, 1400);
    playMixing(r, g, b, durationMs);
    Serial.println("OK MIX");
    return;
  }

  if (action == "RESULT") {
    String kind = tokenAt(command, 1);
    int r = readIntToken(command, 2, currentRed);
    int g = readIntToken(command, 3, currentGreen);
    int b = readIntToken(command, 4, currentBlue);

    if (kind == "success") {
      playSuccess(r, g, b);
    } else if (kind == "partial") {
      playPartial(r, g, b);
    } else {
      playFail(r, g, b);
    }

    Serial.println("OK RESULT");
  }
}

String tokenAt(String value, int tokenIndex) {
  int currentToken = 0;
  int start = 0;

  for (int i = 0; i <= value.length(); i++) {
    if (i == value.length() || value.charAt(i) == ' ') {
      if (currentToken == tokenIndex) return value.substring(start, i);
      currentToken++;
      start = i + 1;
    }
  }

  return "";
}

int readIntToken(String value, int tokenIndex, int fallback) {
  String token = tokenAt(value, tokenIndex);
  if (token.length() == 0) return fallback;
  return constrain(token.toInt(), 0, 255);
}

int readDurationToken(String value, int tokenIndex, int fallback) {
  String token = tokenAt(value, tokenIndex);
  if (token.length() == 0) return fallback;
  return constrain(token.toInt(), 100, 5000);
}

void setRgb(int r, int g, int b) {
  currentRed = constrain(r, 0, 255);
  currentGreen = constrain(g, 0, 255);
  currentBlue = constrain(b, 0, 255);

  analogWrite(redPin, currentRed);
  analogWrite(greenPin, currentGreen);
  analogWrite(bluePin, currentBlue);
}

void fadeTo(int r, int g, int b, int steps, int waitMs) {
  int startRed = currentRed;
  int startGreen = currentGreen;
  int startBlue = currentBlue;

  for (int i = 1; i <= steps; i++) {
    setRgb(
      startRed + (r - startRed) * i / steps,
      startGreen + (g - startGreen) * i / steps,
      startBlue + (b - startBlue) * i / steps
    );
    delay(waitMs);
  }
}

void turnOff() {
  setRgb(0, 0, 0);
  noTone(buzzerPin);
}

void playMixing(int r, int g, int b, int durationMs) {
  unsigned long startedAt = millis();
  int notes[] = {196, 247, 294, 330, 392, 494, 523, 659};
  int noteIndex = 0;

  while (millis() - startedAt < (unsigned long)durationMs) {
    int phase = noteIndex % 4;
    int pulse = phase < 2 ? 255 : 90;

    setRgb(
      max(10, r * pulse / 255),
      max(10, g * (255 - phase * 35) / 255),
      max(10, b * (180 + phase * 20) / 255)
    );

    tone(buzzerPin, notes[noteIndex % 8], 70);
    delay(95);
    noteIndex++;
  }

  noTone(buzzerPin);
  fadeTo(r, g, b, 10, 10);
}

void playSuccess(int r, int g, int b) {
  fadeTo(255, 255, 255, 8, 18);
  tone(buzzerPin, 523, 90);
  delay(110);
  fadeTo(r, g, b, 8, 18);
  tone(buzzerPin, 659, 90);
  delay(110);
  fadeTo(255, 255, 180, 8, 18);
  tone(buzzerPin, 784, 120);
  delay(140);
  fadeTo(r, g, b, 12, 16);
  tone(buzzerPin, 1047, 220);
  delay(250);
  noTone(buzzerPin);
}

void playPartial(int r, int g, int b) {
  for (int i = 0; i < 3; i++) {
    fadeTo(r, g, b, 6, 18);
    tone(buzzerPin, 392 + i * 55, 80);
    delay(100);
    fadeTo(r / 3, g / 3, b / 3, 6, 18);
    tone(buzzerPin, 330 + i * 42, 80);
    delay(100);
  }

  fadeTo(r, g, b, 12, 16);
  noTone(buzzerPin);
}

void playFail(int r, int g, int b) {
  for (int i = 0; i < 4; i++) {
    setRgb(255, 20, 0);
    tone(buzzerPin, 220 - i * 25, 90);
    delay(110);
    setRgb(20, 0, 0);
    delay(80);
  }

  fadeTo(r, g, b, 10, 18);
  tone(buzzerPin, 147, 220);
  delay(250);
  noTone(buzzerPin);
}
