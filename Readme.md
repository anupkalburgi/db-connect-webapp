# Interactive web application using Databricks Connect and Flask
This is a simple example of how to create an interactive web application using Databricks Connect and Flask.
TODO: Add more details about the project.

## Prerequisites

Python version:
```python
python 3.12.7
```

Install the required libraries:
```bash
pip install -r requirements.txt
```

### Backend Connectivity to Databricks
#### DB Connect ####  
The application uses [Databricks Connect](https://docs.databricks.com/en/dev-tools/databricks-connect/index.html) to connect the backend API services to Databricks compute services.

#### Cluster Configuration ####
A shared Databricks cluster is required for providing backend Databricks data and compute services.  
*ToDo* Serverless Compute support has not been added to this app yet (WIP)

#### M2M OAuth Service Principal (SP) #### 
Authentication to Databricks uses OAuth M2M  [Machine-to-Machine OAuth](https://docs.databricks.com/en/dev-tools/auth/oauth-m2m.html)  
A Personal Access Token (PAT) can be used for development and testing. 

#### Cluster Privileges 
Grant access on the Cluster to the SP `Application ID`.  
*Compute* -> *More* (top right Web GUI) -> *Permissions* -> add the Service Principal.

#### Set Databricks DB Connect Environment Variables
To connect to a shared cluster using a SP set the following environment variables
+ `DATABRICKS_HOST`  - This is the workspace URL, EG `https://<my-workspace>.databricks.com/`  
+ `DATABRICKS_CLUSTER_ID` - This is the name of the shared cluster to connect to.  
+ `DATABRICKS_CLIENT_ID` - This is the M2M OAuth SP *Application ID* to authenticate with.    
+ `DATABRICKS_CLIENT_SECRET` - This is the M2M OAuth SP *Secret* that is shown when a new SP Secret is created.  
Alternatively, for local development and testing, 
+ `DATABRICKS_TOKEN` can be set *instead of* `DATABRICKS_CLIENT_ID` & `DATABRICKS_CLIENT_SECRET`

Using environment variables to set the access parameters for the backend makes it easy to deploy the app and securely integrate it into an enterprise environment.  
A wrapper for extracting connect details and secrets from a secret store can be incorporated into the deployment to avoid storing secrets in local files.   

#### Connecting via `backend.DataSource()` object

`backend/DataSource.py` allows a backend `DataSource()` instance to be initialised in Python code which has a Spark session connection as an object-instance attribute.

#### Backend Connectivity Test and Example 
See the example `auth_session_version.py` for testing backend connectivity and seeing an example of how to integrate with the Databricks Connect spark session for data operations.


## Running the Application 

Run the following command to start the Flask server:
```bash
python app.py
```







## Deploying the application
TODO: Add instructions on how to deploy the application to a cloud provider.
