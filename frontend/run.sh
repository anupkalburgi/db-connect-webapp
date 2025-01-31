#!/bin/bash
source venv/bin/activate
export FLASK_APP=run.py
export FLASK_ENV=development
python run.py