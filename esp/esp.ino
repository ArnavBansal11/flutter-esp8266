#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WifiClient.h>

#include "certs.h"
#include "Arduino_JSON.h"

const char* ssid = "DPSN WIFI";
const char* password = "30@dpsnoida";

const char* baseUrl = "https://jsonplaceholder.typicode.com/todos/1";

ESP8266WebServer server(80);

void handleRoot() {
  server.send(200, "text/plain", "hello from esp8266!\r\n");
}

void handleWifiUpdate(){
  String ssid;
  String password;

  for (uint8_t i = 0; i < server.args(); i++) {
     if(server.argName(i) == "ssid"){
      ssid = server.arg(i);
     } else if(server.argName(i) == "password") {
      password = server.arg(i);
     }
  }

  if(!ssid || !password){
    server.send(403, "text/plain", "Credentials Missing");
    return;
  }

  server.send(200, "text/plain", "Saved");

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
  Serial.begin(115200);
  Serial.println();

  WiFi.mode(WIFI_AP);
  WiFi.softAP("esp8266");

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP Address: ");
  Serial.println(IP);
  Serial.print("The IP Address of ESP8266 Module is: ");
  Serial.print(WiFi.localIP());
  Serial.println();

  if(MDNS.begin("esp8266")) {
    Serial.println("MDNS Responder Started");
  }

  server.on("/", handleRoot);
  server.on("/wifi/update", handleWifiUpdate);
  server.onNotFound(handleNotFound);

  server.begin();
}

void loop() {
  server.handleClient();
  MDNS.update();
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
