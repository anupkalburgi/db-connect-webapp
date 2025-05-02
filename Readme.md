# DB Connect WebApp

## Overview

The **DB Connect WebApp** is an interactive web application designed to connect to Databricks using Databricks Connect and Flask for backend services, and a React-based frontend for user interaction. The application enables users to interact with datasets, perform analysis, and visualize data seamlessly.

This repository is structured into two main components:

- **Backend**: Handles API services, connects to Databricks, and processes data.
- **Frontend**: Provides a user interface for dataset selection, querying, and visualization.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python** (v3.12.7 or later)
- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Docker** (optional, for containerized deployment)

---

## Project Structure

```bash
DB-CONNECT-WEBAPP
├── backend
│   ├── app/                # Backend application code
│   ├── .venv               # Backend virtual environment
│   ├── requirements.txt    # Backend dependencies
│   ├── run.sh              # Script to set up and run the backend
│   └── README.md           # Backend-specific README
├── frontend
│   ├── app/                # Frontend application code
│   ├── run.sh              # Script to set up and run the frontend
│   └── README.md           # Frontend-specific README
└── README.md               # This file
```

---

## Backend

The backend is built using **Flask** and integrates with **Databricks Connect** to provide data and compute services. It handles API requests, connects to Databricks clusters, and processes data for the frontend.

### Key Features

- Connects to Databricks using [Databricks Connect](https://docs.databricks.com/en/dev-tools/databricks-connect/index.html).
- Supports OAuth M2M authentication for secure access.
- Provides APIs for querying datasets and performing operations.

### Setup and Running

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Set up environment variables for Databricks connectivity:

   ```bash
   export DATABRICKS_HOST=https://<my-workspace>.databricks.com/
   export DATABRICKS_CLIENT_ID=<client-id>
   export DATABRICKS_CLIENT_SECRET=<client-secret>
   ```

   For local development, you can use a Personal Access Token (PAT):

   ```bash
   export DATABRICKS_TOKEN=<personal-access-token>
   ```

3. Run the backend server:

   ## Setup and Installation

   ```bash
   ./run.sh
   ```

### Testing the Backend

The script also provides options for running tests:

   ```bash
   # Run tests
   ./run.sh test

   # Run tests with verbose output
   ./run.sh test-v
   ```

### Available Options

| Option  | Description |
|---------|-------------|
| `run`   | Run the FastAPI application (default) |
| `test`  | Run the tests |
| `test-v`| Run the tests in verbose mode |
| `help`  | Show help message |

The backend will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

For more details, refer to the [backend README](./backend/README.md).

---

## Frontend

The frontend is built using **React**, **Next.js**, and **Tailwind CSS**. It provides a modern user interface for interacting with datasets, building queries, and visualizing results.

### Key Features

- Dataset browsing and selection.
- Query building with filters, group-by, and aggregations.
- Visualization of query results.
- Modular and reusable UI components.

### Setup and Running

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   Or, if you prefer `yarn`:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the `frontend` directory and add the following:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
   NEXT_PUBLIC_CATALOG=<catalog-name>
   NEXT_PUBLIC_DATABASE=<database-name>
   ```

   Replace the URL with the actual backend API base URL.

4. Run the frontend server:

   ```bash
   # Run in development mode (default)
   ./run.sh

   # OR explicitly specify development mode
   ./run.sh dev

   # Run in production mode
   ./run.sh prod
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000).

For more details, refer to the [frontend README](./frontend/README.md).

---


## Development Notes

### Backend Connectivity to Databricks

The backend uses [Databricks Connect](https://docs.databricks.com/en/dev-tools/databricks-connect/index.html) to connect to Databricks clusters. Ensure you have the necessary environment variables set up for authentication and cluster access. For more details, refer to the [backend README](./backend/README.md).

### Frontend API Integration

The frontend communicates with the backend using RESTful APIs. Ensure the `NEXT_PUBLIC_API_BASE_URL` environment variable is correctly set to point to the backend server.

---

## Docker/Podman Setup

Both frontend and backend can be run using Docker/Podman with the `podman_setup.sh` script.

### Prerequisites
- Docker or Podman
- podman-compose (if using compose mode)

### Running with Docker/Podman

```bash
# Make the script executable (first time only)
chmod +x docker_setup.sh

# Run frontend and backend as separate services (default)
./docker_setup.sh

# Run using compose mode
./docker_setup.sh -m compose
```

This will:
1. Ensure the Podman machine is running
2. Clean up existing containers and images
3. Build and run the services based on the selected mode

### Available Options

| Option | Description |
|--------|-------------|
| `-m, --mode MODE` | Mode to run services (separate or compose, default: separate) |
| `-f, --frontend PATH` | Path to frontend Dockerfile (default: ./frontend/Dockerfile) |
| `-b, --backend PATH` | Path to backend Dockerfile (default: ./backend/Dockerfile) |
| `-c, --compose PATH` | Path to compose file (default: ./docker-compose.yml) |
| `-h, --help` | Show help information |

### Service Endpoints

- Frontend: http://localhost:3000
- Backend: http://localhost:8000


## Databricks App Deployment Guide

### Usage

Run the deployment script with the following parameters:

```bash
./databricks_app_build.sh <workspace_path> <app_name>
```

### Parameters

- `workspace_path`: The path in Databricks workspace where the app files will be stored
- `app_name`: The name of your Databricks app


### Example

```bash
./databricks_app_build.sh /Workspace/Apps/data_explorer data_explorer
```

### Environment Variables

The script sets the following environment variables:

- `NEXT_PUBLIC_DEPLOYMENT_MODE=integrated`: Configures the frontend for integrated mode
- `STATIC_FILES_DIR`: Points to the static files directory