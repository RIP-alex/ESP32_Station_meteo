/**
 * ===================================================================
 * FICHIER : sensor_manager.h
 * RESPONSABILITÉ : Gestion du capteur DHT22
 * ===================================================================
 */

#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <DHT.h>

struct DonneesCapteur {
    float temperature;
    float humidite;
    bool valide;
};

class SensorManager {
public:
    SensorManager(uint8_t pin, uint8_t type);
    
    // Méthodes publiques
    bool initialiser();
    DonneesCapteur lireDonnees();
    
private:
    DHT _dht;
};

#endif // SENSOR_MANAGER_H