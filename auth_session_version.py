# get the Spark cluster version for the remote backend Databricks cluster.  Validates the auth and connectivity.
import argparse
import os

import backend


def get_sp_session(host, cluster, sp_client, client_secret):
    # connect to Classic compute using a Service Principal - needs to be shared cluster (grant SP privs to the cluster)
    return backend.cluster_session(databricks_host=host,
                                   cluster_id=cluster,
                                   databricks_client_id=sp_client,
                                   databricks_client_secret=client_secret)


def get_pat_session(host, cluster, pat):
    # connect to Classic compute using a Personal Access Token - can be a single user cluster for the owner of the PAT
    return backend.cluster_session(databricks_host=host,
                                   cluster_id=cluster,
                                   pat_token=pat)


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description="Test connection to a cluster. If sp_client is supplied, use SP auth.",
                                     formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument('-host', dest='host', action='store', help='Workspace host URL https://<workspace>/',
                        required=True)
    parser.add_argument('-cluster', dest='cluster', action='store', help='Cluster for non-serverless connect',
                        required=True)
    parser.add_argument('-sp_client', dest='sp_client', action='store', help='Service Principal Client ID (App ID)',
                        required=False)

    args = vars(parser.parse_args())
    client_secret = os.environ.get("DATABRICKS_CLIENT_SECRET")
    pat = os.environ.get("DATABRICKS_TOKEN")

    # If a Service Principal client ID is passed use a Databricks Client Secret, else use a PAT token
    if args['sp_client']:
        if client_secret:
            # unset the DATABRICKS_TOKEN if it is set
            os.environ.pop('DATABRICKS_TOKEN', None)
            spark = get_sp_session(args['host'], args['cluster'], args['sp_client'], client_secret)
        else:
            raise ValueError('DATABRICKS_CLIENT_SECRET environment var is not set')
    else:
        if pat:
            spark = get_pat_session(args['host'], args['cluster'], pat)
        else:
            raise ValueError('DATABRICKS_TOKEN environment var is not set')

    # show the spark cluster version
    print(f"Connected to Spark Cluster version {spark.version}")

    # get some sample data
    df = spark.table('samples.nyctaxi.trips')
    df.limit(5).show()

