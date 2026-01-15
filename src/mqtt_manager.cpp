/**
 * ===================================================================
 * FICHIER : mqtt_manager.cpp
 * RESPONSABILITÉ : Implémentation de la gestion MQTT
 * ===================================================================
 */

#include "mqtt_manager.h"
#include "config.h"

MQTTManager::MQTTManager(const char* broker, int port, const char* clientId, const char* topic)
    : _broker(broker), _port(port), _clientId(clientId), _topic(topic), 
      _derniereReconnexion(0) {}

bool MQTTManager::initialiser(WiFiClient& wifiClient) {
    _mqttClient.setClient(wifiClient);
    _mqttClient.setServer(_broker, _port);
    return true;
}

void MQTTManager::connecter() {
    if (_mqttClient.connected()) {
        return;
    }
    
    Serial.println("📨 Connexion MQTT...");
    Serial.print("   Broker: ");
    Serial.print(_broker);
    Serial.print(":");
    Serial.println(_port);
    
    if (_mqttClient.connect(_clientId)) {
        Serial.println("✅ MQTT connecté !");
    } else {
        Serial.print("❌ Échec MQTT (code: ");
        Serial.print(_mqttClient.state());
        Serial.println(")");
    }
}

void MQTTManager::verifierEtReconnecter() {
    unsigned long maintenant = millis();

    if (maintenant - _derniereReconnexion < RECONNECT_INTERVAL) {
        return;
    }
    
    if (!_mqttClient.connected()) {
        Serial.println("⚠️  MQTT déconnecté ! Reconnexion...");
        connecter();
        _derniereReconnexion = maintenant;
    }
}

bool MQTTManager::estConnecte() {
    return _mqttClient.connected();
}

void MQTTManager::loop() {
    _mqttClient.loop();
}

bool MQTTManager::envoyerDonnees(float temperature, float humidite) {
    if (!_mqttClient.connected()) {
        Serial.println("⚠️  MQTT déconnecté, envoi impossible");
        return false;
    }
    
    if (isnan(temperature) || isnan(humidite)) {
        Serial.println("⚠️  Données invalides, envoi annulé");
        return false;
    }
    
    // Construction du JSON
    String payload = "{\"temp\":";
    payload += String(temperature, 1);
    payload += ",\"hum\":";
    payload += String(humidite, 1);
    payload += "}";
    
    Serial.println("📤 Envoi MQTT...");
    Serial.print("   Topic: ");
    Serial.println(_topic);
    Serial.print("   Payload: ");
    Serial.println(payload);
    
    bool succes = _mqttClient.publish(_topic, payload.c_str());
    
    if (succes) {
        Serial.println("✅ Envoi réussi !");
    } else {
        Serial.println("❌ Échec envoi MQTT");
    }
    
    return succes;
}