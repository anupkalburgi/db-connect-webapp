#!/bin/bash
set -e

echo "🚀 Starting Flask project setup..."

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install project and dependencies from pyproject.toml
pip install --upgrade pip setuptools wheel
pip install -e .