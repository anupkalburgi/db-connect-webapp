from typing import Union
import os

from fastapi import FastAPI

from backend import auth

# authenticate to Databricks

host = os.environ.get("DATABRICKS_HOST")
cluster = os.environ.get("DATABRICKS_CLUSTER_ID")
sp_client = os.environ.get("DATABRICKS_CLIENT_ID")
sp_secret = os.environ.get("DATABRICKS_CLIENT_SECRET")
pat = os.environ.get("DATABRICKS_TOKEN")


#spark = auth.cluster_session(host, cluster, sp_client,  sp_secret)

#print("pre-loading taxi data from spark...")
#df = spark.table('samples.nyctaxi.trips')
#taxis_20 = df.limit(20)
#taxis_20p = taxis_20.toPandas()
#taxis_dict = taxis_20p.to_dict()
#print("...data loaded")

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):

    return {"item_id": item_id, "q": q}


@app.get("/taxis_top_20")
def read_taxis():

    return taxis_dict
