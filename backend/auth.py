import os

from databricks.connect import DatabricksSession
from databricks.sdk.core import Config

import requests
from requests.auth import HTTPBasicAuth


def get_m2m_oauth(databricks_host, client_id, client_secret):
    """get an OAUTH token for a Service Principle using M2M auth
    :param str databricks_host: the web URL for the workspace EG https://myhost.cloud.databricks.com/
    :param str client_id: the SP configurations "application ID"
    :param str client_secret: the Secret displayed when setting up the Oauth M2M service principle

    :return: OAuth token
    """

    # Construct the URL for the token endpoint
    url = f"{databricks_host}/oidc/v1/token"

    # Set up the data and authentication for the request
    data = {
        "grant_type": "client_credentials",
        "scope": "all-apis"
    }

    try:
        response = requests.post(url, auth=HTTPBasicAuth(client_id, client_secret), data=data)
        # Raise an exception if the response status is not 200
        response.raise_for_status()

        # If successful, process the response
        token = response.json()
        return token['access_token']

    except requests.exceptions.HTTPError as http_err:
        raise Exception(f"HTTP error occurred: {http_err} - Response content: {response.text}") from http_err

    except Exception as err:
        raise Exception(f"An error occurred: {err}")


def cluster_session(databricks_host, cluster_id=None, databricks_client_id=None, databricks_client_secret=None,
                    pat_token=None):
    """ connect to a Databricks compute cluster and return an authenticated session
        Usage scenarios:
        1. Classic: pass a databricks_host, cluster id and PAT token
        2. Classic with Service Principal: databricks_host, cluster id, SP client id, SP client secret
        3. Serverless with Service Principal: databricks_host, SP client id, SP client secret
    In all cases, pass in the param values and then set them as OS env vars for the SDK to pick up

    :param str databricks_host: Workspace URL - EG https://my-host.cloud.databricks.com/
    :param str cluster_id:
    :param str databricks_client_id: M2M OAuth Service Principle Client ID - EG 1234abcd-e961-44c9-ae13-9871ffff12ab
    :param str databricks_client_secret: M2M OAuth Service Principle Client Secret
    :param str pat_token:

    :return: Spark session
    """

    if cluster_id and not pat_token:
        # Classic with Service Principal
        os.environ['DATABRICKS_HOST'] = databricks_host
        os.environ['DATABRICKS_CLUSTER_ID'] = cluster_id
        os.environ['DATABRICKS_CLIENT_ID'] = databricks_client_id
        os.environ['DATABRICKS_CLIENT_SECRET'] = databricks_client_secret

        # return spark session, set validateSession to supress false "cluster does not exist" warnings
        return DatabricksSession.builder.validateSession(False).getOrCreate()
    elif cluster_id and pat_token:
        # Classic with PAT token
        os.environ['DATABRICKS_HOST'] = databricks_host
        os.environ['DATABRICKS_CLUSTER_ID'] = cluster_id
        os.environ['DATABRICKS_TOKEN'] = pat_token

        # return spark session, set validateSession to supress false "cluster does not exist" warnings
        return DatabricksSession.builder.validateSession(False).getOrCreate()
    elif not cluster_id:
        # serverless compute session
        return DatabricksSession.builder.serverless().getOrCreate()

    raise Exception ('Unhandled set of conditions')


