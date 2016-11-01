#include <Arduino.h>
#include <SPI.h>
#if not defined (_VARIANT_ARDUINO_DUE_X_) && not defined (_VARIANT_ARDUINO_ZERO_)
  #include <SoftwareSerial.h>
#endif

#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"

#include "BluefruitConfig.h"

#include "MotorConfig.h"

Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

int RPIN = 13;  // what PIN are you using for RED?
int BPIN = 11; // what PIN are you using for BLUE?
int GPIN = 10; // what PIN are you using for GREEN?

String header = "186;186;170;170;";
String data = "";
String separator = ";";
String cmdCode = "";
String cmdValues = "";
String cmdValue = "";

int r = 0;
int g = 0;
int b = 0;

int motorDirection = 0;

void setup(void)
{
  Serial.begin(115200);
  Serial.println(F("Adafruit Bluefruit Command <-> Data Mode Example"));
  Serial.println(F("------------------------------------------------"));

  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) )
  {
    Serial.println(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  ble.verbose(false);  // debug info is a little annoying after this point!
  ble.setMode(BLUEFRUIT_MODE_DATA);
  setAllLedlight(255, 0, 0);
  delay(500);

  setAllLedlight(0, 255, 0);
  delay(500);

  setAllLedlight(0, 0, 255);
  delay(500);

  setAllLedlight(0, 0, 0);

  pinMode(MOTOR_1_1, OUTPUT);
  pinMode(MOTOR_1_2, OUTPUT);
  pinMode(MOTOR_1_P, OUTPUT);

  pinMode(MOTOR_2_1, OUTPUT);
  pinMode(MOTOR_2_2, OUTPUT);
  pinMode(MOTOR_2_P, OUTPUT);
}


void loop(void)
{
  if (! ble.isConnected()) {
    return;
  }

  if ( ble.available() )
  {
    Serial.print("bluetooth write : ");
    data = "";

    while ( ble.available() )
    {
      byte toSend = (byte)ble.read();
      data.concat(String(toSend, DEC));
      data.concat(separator);
    }

    Serial.println(data);

    extractCommand();
    execCommand();
  }
}

void execCommand() {

  switch (cmdCode.toInt()) {
    case 3:
      Serial.println("Led command");
      r = nextCommandValue();
      g = nextCommandValue();
      b = nextCommandValue();
      setAllLedlight(r, g, b);
      break;
    case 2:
      Serial.println("Motor command");
      motorDirection = nextCommandValue();
      activateMotors(motorDirection);
      break;
    default:
      // if nothing else matches, do the default
      // default is optional
    break;
  }

}

void extractCommand() {
  if (data.startsWith(header)) {
    String cmd = data.substring(data.indexOf(header) + header.length());
    cmdCode = cmd.substring(0, cmd.indexOf(separator));
    cmdValues = cmd.substring(cmd.indexOf(separator) + 1);
  }
}

int nextCommandValue() {
  cmdValue = cmdValues.substring(0, cmdValues.indexOf(separator));
  cmdValues = cmdValues.substring(cmdValues.indexOf(separator) + 1);
  return cmdValue.toInt();
}

// LED
void setAllLedlight(int redValue, int greenValue, int blueValue) {
  setLedlight(RPIN, redValue);
  setLedlight(GPIN, greenValue);
  setLedlight(BPIN, blueValue);
}

void setLedlight(int pin, int value) {
  analogWrite(pin,map(value, 0, 255, 0, 1023));
}

// MOTOR
void activateMotors(int pDirection) {
  switch (pDirection) {
    case STOP:
      Serial.println("Stop");
      setAllLedlight(0, 0, 0);
      activateMotor(MOTOR_1, STOP, POWER_OFF);
      activateMotor(MOTOR_2, STOP, POWER_OFF);
      break;
    case FRONT:
      Serial.println("Front");
      setAllLedlight(128, 192, 256);
      activateMotor(MOTOR_1, FRONT, POWER_MAX);
      activateMotor(MOTOR_2, FRONT, POWER_MAX);
      break;
    case BACK:
      Serial.println("back");
      setAllLedlight(255, 0, 0);
      activateMotor(MOTOR_1, BACK, POWER_MAX);
      activateMotor(MOTOR_2, BACK, POWER_MAX);
      break;
    case LEFT:
      Serial.println("Left");
      setAllLedlight(255, 200, 0);
      activateMotor(MOTOR_2, STOP, POWER_MAX);
      activateMotor(MOTOR_1, FRONT, POWER_MAX);
      break;
    case RIGHT:
      Serial.println("Right");
      setAllLedlight(255, 200, 0);
      activateMotor(MOTOR_2, FRONT, POWER_MAX);
      activateMotor(MOTOR_1, STOP, POWER_OFF);
      break;
    case TORNADO_L:
      Serial.println("Tornado Left");
      setAllLedlight(128, 256, 0);
      activateMotor(MOTOR_2, BACK, POWER_MAX);
      activateMotor(MOTOR_1, FRONT, POWER_MAX);
      break;
    case TORNADO_R:
      Serial.println("Tornado Right");
      setAllLedlight(128, 256, 0);
      activateMotor(MOTOR_2, FRONT, POWER_MAX);
      activateMotor(MOTOR_1, BACK, POWER_MAX);
      break;
    default:
    break;
  }

}

void activateMotor(int pMotor,int pDirection,int pPuissance) {
  int pin1, etat1, pin2, etat2, pinP, puissance;

  //test numéro du moteur
  if (pMotor == MOTOR_1){
    pin1=MOTOR_1_1;
    pin2=MOTOR_1_2;
    pinP=MOTOR_1_P;
  } else if (pMotor == MOTOR_2) {
    pin1=MOTOR_2_1;
    pin2=MOTOR_2_2;
    pinP=MOTOR_2_P;
  } else {
    return;
  }

  //test sens du moteur 1,-1 (sens contrainre) ou tout autre valeur (stoppe le moteur)
  if (pDirection == FRONT){
    etat1 = 1;
    etat2 = 0;
  } else if (pDirection == BACK) {
    etat1 = 0;
    etat2 = 1;
  } else {
    etat1 = 0;
    etat2 = 0;
  }

  puissance = map(pPuissance, 0, 100, 0, 255);
  Serial.print("puissance : ");
  Serial.println(puissance);
  Serial.print("etat1 : ");
  Serial.println(etat1);
  Serial.print("etat2 : ");
  Serial.println(etat2);
  digitalWrite(pin1, etat1);
  digitalWrite(pin2, etat2);
  analogWrite(pinP, puissance);

}
