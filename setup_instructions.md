# Project Setup Guide

This README provides instructions for setting up and running both the frontend and backend components of the project, either directly or using Docker/Podman.

## Table of Contents
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Docker/Podman Setup](#dockerpodman-setup)

## Backend Setup

The backend is a FastAPI application that can be run directly using the `setup.sh` script.

### Prerequisites
- Python 3.x
- pip

### Running the Backend

```bash
cd backend

# Make the script executable (first time only)
chmod +x setup.sh

# Run the FastAPI application
./setup.sh run
```

This will:
1. Create a virtual environment if it doesn't exist
2. Activate the virtual environment
3. Install the required packages from requirements.txt
4. Start the FastAPI application on http://localhost:8000

### Testing the Backend

The script also provides options for running tests:

```bash
# Run tests
./setup.sh test

# Run tests with verbose output
./setup.sh test-v
```

### Available Options

| Option  | Description |
|---------|-------------|
| `run`   | Run the FastAPI application (default) |
| `test`  | Run the tests |
| `test-v`| Run the tests in verbose mode |
| `help`  | Show help message |

## Frontend Setup

The frontend is a Next.js application that can be run using the `setup.sh` script.

### Prerequisites
- Node.js 18 or later
- npm

### Running the Frontend

```bash
cd frontend

# Make the script executable (first time only)
chmod +x setup.sh

# Run in development mode (default)
./setup.sh

# OR explicitly specify development mode
./setup.sh dev

# Run in production mode
./setup.sh prod
```

This will:
1. Check if Node.js is installed and version is 18+
2. Install dependencies using `npm ci`
3. Start the application in the specified mode

In development mode, the application will be available at http://localhost:3000 with hot reloading enabled.

In production mode, the application will be built for production and served using `serve` at http://localhost:3000.

## Docker/Podman Setup

Both frontend and backend can be run using Docker/Podman with the `podman_setup.sh` script.

### Prerequisites
- Docker or Podman
- podman-compose (if using compose mode)

### Running with Docker/Podman

```bash
# Make the script executable (first time only)
chmod +x podman_setup.sh

# Run frontend and backend as separate services (default)
./podman_setup.sh

# Run using compose mode
./podman_setup.sh -m compose
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