# Interactive web application using Databricks Connect and Flask
This is a simple example of how to create an interactive web application using Databricks Connect and Flask.
TODO: Add more details about the project.


## Running the application
### Prerequisites

Python version:
```python
python 3.12.7
```
Install databricks cli: [Databricks CLI](https://docs.databricks.com/en/dev-tools/cli/install.html)

```bash
pip install databricks-cli
```

And authenticate with your databricks account:
```bash
databricks auth login
```

### Running Application 
1. Install the required libraries by running the following command:
```bash
pip install -r requirements.txt
```

2. Run the following command to start the Flask server:
```bash
python app.py
```

## Backend Connectivity and Authentication to Databricks
The application uses [Databricks Connect](https://docs.databricks.com/en/dev-tools/databricks-connect/index.html) to connect the backend API services to Databricks compute and data.

Authentication to Databricks uses OAuth M2M  [Machine-to-Machine OAuth](https://docs.databricks.com/en/dev-tools/auth/oauth-m2m.html) 
  
The **Identity Federation Disabled** path for configuring a Service Principal in a Databricks Workspace is used.   


Dependencies: 
+ Databricks must be Unity Catalog enabled  
+ A service principal needs to be created in the workspace.  
+ Workspace privileges need to be added to the service principle - details ToDo 
+ A client ID and associated OAuth secret needs to be created for the service principle and the details used for setting up the backend authentication

Alternatively, single user PAT token authentication can be used for local development testing. 

### Backend Authentication Parameters and Environment Variables

To connect to a shared cluster using a SP set the following environment variables
`DATABRICKS_HOST`
`DATABRICKS_CLUSTER_ID`
`DATABRICKS_CLIENT_ID`
`DATABRICKS_CLIENT_SECRET`


See the example `auth_session_version.py` for backend connectivity examples.  
This shows an example of getting command-line arguments and environment variables for the token to pass for authentication.


## Deploying the application
TODO: Add instructions on how to deploy the application to a cloud provider.
