""" Backend Interface to the Databricks Lakehouse """
import os

from databricks.connect import DatabricksSession

class DataSource:
    """Initialise a DataSource instance

    Initialise a connection based on env vars
    DATABRICKS_HOST must be set.

    If DATABRICKS_CLIENT_ID and DATABRICKS_CLIENT_SECRET are set, try to connect that way.
    Otherwise, try to connect with PAT Token

    """
    def __init__(self):

       # always need to specify the workspace URL
        if os.environ.get("DATABRICKS_HOST"):
            self.databricks_host = os.environ["DATABRICKS_HOST"]
        else:
            raise Exception('DATABRICKS_HOST environment variable not set')

        # this can be None for Serverless
        if os.environ.get("DATABRICKS_CLUSTER_ID"):
            self.databricks_cluster_id = os.environ["DATABRICKS_CLUSTER_ID"]
        else:
            self.databricks_cluster_id = None
            #Todo - implement Serveless Connect functionality
            raise Exception("Serverless not implemented yet")

        # Service Principal ID, can be None for a PAT connection
        if os.environ.get("DATABRICKS_CLIENT_ID"):
            self.databricks_client_id = os.environ["DATABRICKS_CLIENT_ID"]
        else:
            self.databricks_client_id = None

        # Service Principal Secret, can be None for a PAT connection
        if os.environ.get("DATABRICKS_CLIENT_SECRET"):
            self.databricks_client_secret = True
        else:
            self.databricks_client_secret = False

        # PAT tokn - can be None is using SP
        if os.environ.get("DATABRICKS_TOKEN"):
            self.databricks_token = True
        else:
            self.databricks_token = False

        if self.databricks_client_id and self.databricks_client_secret:
            # connect to Service Principal
            os.environ.pop('DATABRICKS_TOKEN', None)
            self.session = DatabricksSession.builder.validateSession(False).getOrCreate()
        elif self.databricks_token:
            # connect using PAT
            self.session = DatabricksSession.builder.validateSession(False).getOrCreate()
        else:
            raise Exception('DATABRICKS_CLIENT_ID and DATABRICKS_CLIENT_SECRET need to be set *or* DATABRICKS_TOKEN')


