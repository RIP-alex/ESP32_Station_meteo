/**
 * ===================================================================
 * PROJET : Station Météo ESP32 - Sprint 3 (Architecture Modulaire)
 * ===================================================================
 * RESPONSABILITÉ : Orchestration uniquement (setup + loop)
 * ===================================================================
 */

#include <Arduino.h>
#include <Wire.h>
#include "config.h"
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "sensor_manager.h"
#include "display_manager.h"

// ============================================================
// INSTANCIATION DES MANAGERS
// ============================================================

WiFiManager wifiManager(WIFI_SSID, WIFI_PASSWORD);
MQTTManager mqttManager(MQTT_BROKER, MQTT_PORT, MQTT_CLIENT_ID, MQTT_TOPIC);
SensorManager sensorManager(DHTPIN, DHTTYPE);
DisplayManager displayManager(SCREEN_WIDTH, SCREEN_HEIGHT, OLED_RESET, OLED_ADDRESS);

WiFiClient wifiClient;

// Variables de timing
unsigned long derniereLecture = 0;

// ============================================================
// SETUP
// ============================================================
void setup() {
    // Initialisation port série
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n╔════════════════════════════════════════╗");
    Serial.println("║   STATION MÉTÉO ESP32 - SPRINT 3      ║");
    Serial.println("║   Architecture Modulaire (SRP)        ║");
    Serial.println("╚════════════════════════════════════════╝\n");
    
    // Initialisation des modules
    if (!displayManager.initialiser()) {
        Serial.println("❌ Erreur initialisation écran");
    }
    if (!sensorManager.initialiser()) {
        Serial.println("❌ Erreur initialisation capteur");
    }
    if (!wifiManager.connecter()) {
        Serial.println("❌ Erreur connexion WiFi");
    }
    
    if (wifiManager.estConnecte()) {
        if (!mqttManager.initialiser(wifiClient)) {
            Serial.println("❌ Erreur initialisation MQTT");
        }
        if (!mqttManager.connecter()) {
            Serial.println("❌ Erreur connexion MQTT");
        }
    }
    
    Serial.println("\n✅ Système prêt !\n");
}

// ============================================================
// LOOP
// ============================================================
void loop() {
    // Maintien connexion MQTT
    mqttManager.loop();
    
    // Vérification et reconnexion WiFi/MQTT
    wifiManager.verifierEtReconnecter();
    if (wifiManager.estConnecte()) {
        mqttManager.verifierEtReconnecter();
    }
    
    // Lecture périodique des données
    unsigned long maintenant = millis();
    
    if (maintenant - derniereLecture >= LECTURE_INTERVAL) {
        derniereLecture = maintenant;
        
        Serial.println("═══════════════════════════════════════");
        
        // Lecture capteur
        DonneesCapteur donnees = sensorManager.lireDonnees();
        
        // Affichage OLED
        displayManager.afficherStatut(
            wifiManager.estConnecte(),
            mqttManager.estConnecte(),
            donnees
        );
        
        // Envoi MQTT
        if (mqttManager.estConnecte() && donnees.valide) {
            mqttManager.envoyerDonnees(donnees.temperature, donnees.humidite);
        }
        
        Serial.println("═══════════════════════════════════════\n");
    }
    
    delay(10);
}