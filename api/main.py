from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from influxdb_client import InfluxDBClient
from typing import Optional, Union
import os

app = FastAPI()

# --- SÉCURITÉ CORS ---
try:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
except Exception as e:
    print(f"Error configuring CORS: {e}")

# --- CONFIGURATION ---
# Correction 1 : On ajoute une valeur par défaut ("") pour garantir que c'est un str
token = os.getenv("INFLUX_TOKEN", "")
org = os.getenv("INFLUX_ORG", "")
bucket = os.getenv("INFLUX_BUCKET", "")
url = "http://influxdb:8086"

@app.get("/")
def read_root():
    return {"status": "API En ligne avec CORS activé ! 🚀"}

@app.get("/data/live")
def get_live_data():
    try:
        client = InfluxDBClient(url=url, token=token, org=org)
        query_api = client.query_api()

        query = f'from(bucket: "{bucket}") |> range(start: -24h) |> last()'
        tables = query_api.query(query, org=org)

        data: dict[str, Optional[Union[int, float]]] = {"temp": None, "hum": None}

        for table in tables:
            for record in table.records:
                field = record.get_field()
                value = record.get_value()
                if field == "temp":
                    data["temp"] = round(value, 1) 
                elif field == "hum":
                    data["hum"] = int(value)
        
        client.close()
        return data
    except Exception as e:
        return {"error": "Database connection failed", "temp": None, "hum": None}

@app.get("/data/average/{days}")
def get_average_data(days: int):
    try:
        client = InfluxDBClient(url=url, token=token, org=org)
        query_api = client.query_api()

        query = f'''
        from(bucket: "{bucket}")
        |> range(start: -{days}d)
        |> filter(fn: (r) => r._field == "temp")
        |> mean()
        '''
        
        tables = query_api.query(query, org=org)
        temp_avg = None
        
        for table in tables:
            for record in table.records:
                temp_avg = round(record.get_value(), 1)
        
        client.close()
        return {"days": days, "temp_avg": temp_avg}
    except Exception as e:
        return {"error": str(e), "days": days, "temp_avg": None}

@app.get("/data/history/{days}")
def get_history_data(days: int):
    try:
        client = InfluxDBClient(url=url, token=token, org=org)
        query_api = client.query_api()

        query = f'''
        from(bucket: "{bucket}")
        |> range(start: -{days}d)
        |> filter(fn: (r) => r._field == "temp")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        '''
        
        tables = query_api.query(query, org=org)
        
        timestamps = []
        temperatures = []
        
        for table in tables:
            for record in table.records:
                timestamps.append(record.get_time().strftime('%d/%m %Hh'))
                temperatures.append(round(record.get_value(), 1))
        
        client.close()
        return {"timestamps": timestamps, "temperatures": temperatures}
    except Exception as e:
        return {"error": str(e), "timestamps": [], "temperatures": []}