/**
 * ===================================================================
 * FICHIER : wifi_manager.cpp
 * RESPONSABILITÉ : Implémentation de la gestion WiFi
 * ===================================================================
 */

#include "wifi_manager.h"
#include "config.h"

WiFiManager::WiFiManager(const char* ssid, const char* password) 
    : _ssid(ssid), _password(password), _derniereReconnexion(0) {}

bool WiFiManager::connecter() {
    if (WiFi.status() == WL_CONNECTED) {
        return true;
    }
    
    Serial.println("📡 Connexion WiFi...");
    Serial.print("   SSID: ");
    Serial.println(_ssid);
    
    WiFi.mode(WIFI_STA);
    WiFi.begin(_ssid, _password);
    
    int tentatives = 0;
    while (WiFi.status() != WL_CONNECTED && tentatives < 20) {
        delay(500);
        Serial.print(".");
        tentatives++;
    }
    Serial.println();
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("✅ WiFi connecté !");
        Serial.print("   IP: ");
        Serial.println(WiFi.localIP());
        return true;
    } else {
        Serial.println("❌ Échec connexion WiFi");
        return false;
    }
}

void WiFiManager::verifierEtReconnecter() {
    unsigned long maintenant = millis();
    
    if (maintenant - _derniereReconnexion < RECONNECT_INTERVAL) {
        return;
    }
    
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("⚠️  WiFi déconnecté ! Reconnexion...");
        connecter();
        _derniereReconnexion = maintenant;
    }
}

bool WiFiManager::estConnecte() const {
    return WiFi.status() == WL_CONNECTED;
}

String WiFiManager::obtenirIP() const {
    return WiFi.localIP().toString();
}