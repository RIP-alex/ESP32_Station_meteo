/**
 * ===================================================================
 * FICHIER : display_manager.h
 * RESPONSABILITÉ : Gestion de l'affichage OLED
 * ===================================================================
 */

#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "sensor_manager.h"

class DisplayManager {
public:
    DisplayManager(uint8_t width, uint8_t height, int8_t reset, uint8_t address);
    
    // Méthodes publiques
    bool initialiser();
    void afficherDemarrage();
    void afficherStatut(bool wifiOK, bool mqttOK, const DonneesCapteur& donnees);
    
private:
    Adafruit_SSD1306 _display;
    uint8_t _address;
};

#endif // DISPLAY_MANAGER_H