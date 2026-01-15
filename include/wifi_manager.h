/**
 * ===================================================================
 * FICHIER : wifi_manager.h
 * RESPONSABILITÉ : Gestion complète de la connexion WiFi
 * ===================================================================
 */

#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>

class WiFiManager {
public:
    WiFiManager(const char* ssid, const char* password);
    
    // Méthodes publiques
    bool connecter();
    void verifierEtReconnecter();
    bool estConnecte() const;
    String obtenirIP() const;
    
private:
    const char* _ssid;
    const char* _password;
    unsigned long _derniereReconnexion;
    //static const unsigned long RECONNECT_INTERVAL = 5000;
};

#endif // WIFI_MANAGER_H