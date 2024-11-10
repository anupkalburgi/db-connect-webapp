from backend.DataSource import *


def get_taxis(spark):
    # get some sample data
    df = spark.table('samples.nyctaxi.trips')
    print(df.limit(5).show())


if __name__ == '__main__':
    # get a DataSource instance
    ds = DataSource()

    # show attributes of the data source instance
    print(f"Connected to Databricks Worskspace host: {ds.databricks_host}")
    print(f"Connected using PAT: {ds.databricks_token}")
    if ds.databricks_client_id:
        print(f"Connected using Service Principal Application ID: {ds.databricks_client_id}")
    print(f"Using Cluster {ds.databricks_cluster_id}")

    # show the spark cluster version
    print(f"Connected to Spark Cluster version {ds.session.version}")

    # pass the spark session to a function to use
    #get_taxis(spark=ds.session)
