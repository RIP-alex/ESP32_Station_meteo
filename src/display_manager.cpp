/**
 * ===================================================================
 * FICHIER : display_manager.cpp
 * RESPONSABILITÉ : Implémentation de l'affichage OLED
 * ===================================================================
 */

#include "display_manager.h"

DisplayManager::DisplayManager(uint8_t width, uint8_t height, int8_t reset, uint8_t address)
    : _display(width, height, &Wire, reset), _address(address) {}

bool DisplayManager::initialiser() {
    Serial.print("📺 Initialisation OLED... ");
    
    if (!_display.begin(SSD1306_SWITCHCAPVCC, _address)) {
        Serial.println("ÉCHEC !");
        return false;
    }
    
    Serial.println("OK ✓");
    afficherDemarrage();
    return true;
}

void DisplayManager::afficherDemarrage() {
    _display.clearDisplay();
    _display.setTextSize(1);
    _display.setTextColor(SSD1306_WHITE);
    _display.setCursor(0, 0);
    _display.println("Station Meteo Maison");
    _display.println("Activation du service");
    _display.println("");
    _display.println("Init...");
    _display.display();
}

void DisplayManager::afficherStatut(bool wifiOK, bool mqttOK, const DonneesCapteur& donnees) {
    _display.clearDisplay();
    _display.setTextSize(1);
    _display.setCursor(0, 0);
    
    // Statut WiFi
    _display.print("WiFi:");
    _display.println(wifiOK ? "OK" : "ERR");
    
    // Statut MQTT
    _display.print("MQTT:");
    _display.println(mqttOK ? "OK" : "ERR");
    
    _display.println("");
    
    // Données (taille auto-adaptée à l'écran)
    uint8_t tailleX = _display.width() > 100 ? 3 : 2;
    uint8_t tailleY = _display.height() > 48 ? 2 : 1;
    _display.setTextSize(tailleX, tailleY);
    
    if (donnees.valide) {
        _display.print("T:");
        _display.print(donnees.temperature, 1);
        _display.println("C");
        
        _display.print("H:");
        _display.print(donnees.humidite, 1);
        _display.println("%");
    } else {
        _display.println("T:ERR");
        _display.println("H:ERR");
    }
    
    _display.display();
}