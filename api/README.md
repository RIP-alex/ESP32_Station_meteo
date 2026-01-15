# 🔌 API REST

API Python FastAPI pour récupérer les données météo depuis InfluxDB.

## 📋 Endpoints

### GET /
Statut de l'API

**Réponse :**
```json
{
  "status": "API En ligne avec CORS activé ! 🚀"
}
```

### GET /data/live
Dernières données en temps réel

**Réponse :**
```json
{
  "temp": 22.5,
  "hum": 65
}
```

### GET /data/average/{days}
Moyenne de température sur N jours

**Paramètres :**
- `days` : Nombre de jours (7 ou 30)

**Réponse :**
```json
{
  "days": 7,
  "temp_avg": 21.3
}
```

### GET /data/history/{days}
Historique des températures pour graphiques

**Paramètres :**
- `days` : Nombre de jours

**Réponse :**
```json
{
  "timestamps": ["13/01 10h", "13/01 11h", ...],
  "temperatures": [20.5, 21.2, ...]
}
```

## 🔧 Configuration

### Variables d'Environnement

```bash
INFLUX_TOKEN=VOTRE_TOKEN_INFLUXDB
INFLUX_ORG=VOTRE_ORGANISATION
INFLUX_BUCKET=station_meteo
```

Définies dans `docker-compose.yml`

### Connexion InfluxDB

```python
url = "http://influxdb:8086"
token = os.getenv("INFLUX_TOKEN", "")
org = os.getenv("INFLUX_ORG", "")
bucket = os.getenv("INFLUX_BUCKET", "")
```

## 🚀 Déploiement

### Docker (Recommandé)

```bash
docker build -t weather-api .
docker run -p 8000:8000 \
  -e INFLUX_TOKEN=votre_token \
  -e INFLUX_ORG=votre_org \
  -e INFLUX_BUCKET=station_meteo \
  weather-api
```

### Local

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📦 Dépendances

```
fastapi
uvicorn
influxdb-client
```

## 🔍 Requêtes InfluxDB

### Dernière Valeur

```flux
from(bucket: "station_meteo")
  |> range(start: -24h)
  |> last()
```

### Moyenne

```flux
from(bucket: "station_meteo")
  |> range(start: -7d)
  |> filter(fn: (r) => r._field == "temp")
  |> mean()
```

### Historique

```flux
from(bucket: "station_meteo")
  |> range(start: -7d)
  |> filter(fn: (r) => r._field == "temp")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
```

## 🔒 CORS

CORS activé pour tous les domaines :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

⚠️ En production, restreindre `allow_origins`

## 🐛 Logs

Les logs Uvicorn affichent :
- Requêtes HTTP avec codes de statut
- Erreurs de connexion InfluxDB
- Temps de réponse

Voir les logs :
```bash
docker logs weather_api
```

## ⚡ Performance

- Connexion InfluxDB par requête (pas de pool)
- Agrégation horaire pour l'historique
- Timeout par défaut
- Gestion des erreurs robuste

## 🔐 Sécurité

- Token InfluxDB en variable d'environnement
- Pas d'authentification API (protégé par Nginx)
- Validation des paramètres
- Gestion des erreurs sans exposition de détails