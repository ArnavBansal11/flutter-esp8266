#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WifiClient.h>
#include <EEPROM.h>

#include "certs.h"
#include "Arduino_JSON.h"

struct {
  String ssid = "";
  String password = "";
} wifiSettings;
int isSetup = 0;


const char* baseUrl = "https://jsonplaceholder.typicode.com/todos/1";

ESP8266WebServer server(80);

void handleRoot() {
  server.send(200, "text/plain", "hello from esp8266!\r\n");
}

void handleWifiUpdate() {
  Serial.println("Hello There");
  String ssid;
  String password;

  for (uint8_t i = 0; i < server.args(); i++) {
    if (server.argName(i) == "ssid") {
      ssid = server.arg(i);
    } else if (server.argName(i) == "password") {
      password = server.arg(i);
    }
  }

  if (!ssid || !password) {
    server.send(403, "text/plain", "Credentials Missing");
    return;
  }

  Serial.println(ssid);
  Serial.println(password);

  wifiSettings.password = password;
  wifiSettings.ssid = ssid;

  int set =5;
  EEPROM.put(16, wifiSettings.password);
  EEPROM.put(0, set);
  EEPROM.commit();

  server.send(200, "text/plain", "Saved");
  delay(2000);

  ESP.reset();
}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) { message += " " + server.argName(i) + ": " + server.arg(i) + "\n"; }
  server.send(404, "text/plain", message);
}

void setup() {
  Serial.begin(9600);
  EEPROM.begin(512);
  Serial.println();

  // for (int i = 0; i < 512; EEPROM.write(i++,0));
  // Serial.println("Erased");

  EEPROM.get(0, isSetup);

  Serial.println("HELLO");
  Serial.println(isSetup);

  if (isSetup != 5) {
    WiFi.mode(WIFI_AP);
    WiFi.softAP("esp8266");

    IPAddress IP = WiFi.softAPIP();
    Serial.print("AP IP Address: ");
    Serial.println(IP);
    Serial.print("The IP Address of ESP8266 Module is: ");
    Serial.print(WiFi.localIP());
    Serial.println();

    if (MDNS.begin("esp8266")) {
      Serial.println("MDNS Responder Started");
    }

    server.on("/", handleRoot);
    server.on("/wifi/update", handleWifiUpdate);
    server.onNotFound(handleNotFound);

    server.begin();
  } else {
    Serial.println("ESP IS SETUP");
    EEPROM.get(16, wifiSettings.ssid);
    EEPROM.get(256, wifiSettings.password);

    WiFi.mode(WIFI_STA);
    WiFi.begin(wifiSettings.ssid, wifiSettings.password);

    Serial.println(wifiSettings.ssid);
    Serial.println(wifiSettings.password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
  }
}

void loop() {
  if (isSetup == 5) {
    server.handleClient();
    MDNS.update();
  }
}

String httpGETRequest(const char* serverName) {
  std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);

  client->setFingerprint(fingerprint_sni_cloudflaressl_com);
  HTTPClient http;
  http.begin(*client, serverName);
  int httpResponseCode = http.GET();

  String payload = "{}";

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  } else {
    Serial.printf("[HTTPS] GET... failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  http.end();

  return payload;
}
