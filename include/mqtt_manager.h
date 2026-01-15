/**
 * ===================================================================
 * FICHIER : mqtt_manager.h
 * RESPONSABILITÉ : Gestion complète MQTT (connexion + envoi)
 * ===================================================================
 */

#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

#include <PubSubClient.h>
#include <WiFiClient.h>

class MQTTManager {
public:
    MQTTManager(const char* broker, int port, const char* clientId, const char* topic);
    
    // Méthodes publiques
    bool initialiser(WiFiClient& wifiClient);
    void connecter();
    void verifierEtReconnecter();
    bool estConnecte();  // ✅ SANS const
    void loop();
    bool envoyerDonnees(float temperature, float humidite);
    
private:
    const char* _broker;
    int _port;
    const char* _clientId;
    const char* _topic;
    PubSubClient _mqttClient;
    unsigned long _derniereReconnexion;
    //static const unsigned long RECONNECT_INTERVAL = 5000;
};

#endif // MQTT_MANAGER_H