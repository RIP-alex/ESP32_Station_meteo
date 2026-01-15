/**
 * ===================================================================
 * FICHIER : sensor_manager.cpp
 * RESPONSABILITÉ : Implémentation de la lecture DHT22
 * ===================================================================
 */

#include "sensor_manager.h"

SensorManager::SensorManager(uint8_t pin, uint8_t type) : _dht(pin, type) {}

bool SensorManager::initialiser() {
    Serial.print("🌡️  Initialisation DHT22... ");
    _dht.begin();
    Serial.println("OK ✓");
    delay(2000); // Stabilisation
    return true;
}

DonneesCapteur SensorManager::lireDonnees() {
    DonneesCapteur donnees;
    
    // Tentative de lecture avec validation
    donnees.temperature = _dht.readTemperature();
    donnees.humidite = _dht.readHumidity();
    
    // Validation des données avec vérification d'erreurs spécifiques
    bool tempValide = !isnan(donnees.temperature) && donnees.temperature > -40 && donnees.temperature < 80;
    bool humValide = !isnan(donnees.humidite) && donnees.humidite >= 0 && donnees.humidite <= 100;
    donnees.valide = tempValide && humValide;
    
    if (!tempValide) {
        Serial.println("❌ Erreur lecture température DHT22");
    }
    if (!humValide) {
        Serial.println("❌ Erreur lecture humidité DHT22");
    }
    
    if (donnees.valide) {
        Serial.print("🌡️  Température : ");
        Serial.print(donnees.temperature, 1);
        Serial.println(" °C");
        Serial.print("💧 Humidité     : ");
        Serial.print(donnees.humidite, 1);
        Serial.println(" %");
    } else {
        Serial.println("❌ Erreur lecture DHT22");
    }
    
    return donnees;
}