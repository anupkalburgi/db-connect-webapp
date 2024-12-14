from app import app
from flask import render_template, request, jsonify
import pandas as pd
import os
import json
import requests

# Sample dataset for demonstration purposes
datasets = {
    'NYC Taxi': pd.DataFrame({
        'pickup_datetime': ['2024-08-01 08:00:00', '2024-08-01 09:00:00'],
        'trip_distance': [1.2, 3.5],
        'fare_amount': [10.5, 20.0],
        'pick_up_zip': ['07302', '07305'],
        'drop_off_zip': ['10001', '10002']
    }),
    'TCDP DI': pd.DataFrame({
        'data_field_1': ['Value1', 'Value2'],
        'data_field_2': [10, 20],
        'data_field_3': ['A', 'B']
    })
}

DEFAULT_CATALOG = "anup_kalburgi"
DEFAULT_DATABASE = "share_explore"
BASE_BACKEND_URL = os.environ.get('BASE_BACKEND_URL', 'http://127.0.0.1:8000/api/v1/')


operator_map = {
        'greater_than': '>',
        'less_than': '<',
        'equals': '='
    }

def fetch_data_from_url(endpoint):
    url = f'{BASE_BACKEND_URL}{endpoint}'
    print(f"Fetching data from URL: {url}")
    response = requests.get(url, headers={'accept': 'application/json'})
    return response

def cast_value(value, value_type):
    if value_type == 'bigint':
        return int(value)
    elif value_type == 'float' or value_type == 'double':
        return float(value)
    elif value_type == 'boolean':
        return value.lower() in ['true', '1', 'yes']
    else:
        return value  # Default to string

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/datasets', methods=['GET'])
def get_datasets():
    endpoint = f'tables?catalog={DEFAULT_CATALOG}&database={DEFAULT_DATABASE}'
    response = fetch_data_from_url(endpoint)
    if response.status_code == 200:
        datasets = response.json()
        return jsonify(datasets)
    else:
        return jsonify({'error': 'Failed to fetch datasets'}), response.status_code


@app.route('/get_columns', methods=['POST'])
def get_columns():
    try:
        dataset_name = request.json.get('dataset')
        if not dataset_name:
            return jsonify({'error': 'Dataset name is required'}), 400

        endpoint = f'table/schema/?catalog={DEFAULT_CATALOG}&database={DEFAULT_DATABASE}&table={dataset_name}'
        response = fetch_data_from_url(endpoint)
        if response.status_code == 200:
            columns = response.json()
            return jsonify(columns)
        else:
            return jsonify({'error': 'Failed to fetch columns'}), response.status_code
    except Exception as e:
        print(f"Failed to get columns: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/get_data', methods=['POST'])
def get_data():
    try:
        dataset_name = request.json.get('dataset')
        columns = request.json.get('columns', [])
        filters = request.json.get('filters', {})
        
        print(filters)

        filter_list = []
        for column, condition in filters.items():
            operator = operator_map.get(condition.get('operator'))
            value = condition.get('value')
            value_type = condition.get('type')
            if operator:
                casted_value = cast_value(value, value_type)
                filter_list.append({
                    "column": column,
                    "operator": operator,
                    "value": casted_value
                })

        endpoint = f'query'
        query_json = {
            "table_name": f"{DEFAULT_CATALOG}.{DEFAULT_DATABASE}.{dataset_name}",
            "limit": 10,
            "filters": filter_list
        }

        print(f"Query JSON: {query_json}")

        response = requests.post(f'{BASE_BACKEND_URL}{endpoint}', json=query_json)
        if response.status_code == 200:
            data = response.json()
            print(data)
            return jsonify(data)
        else:
            print(f"Failed to fetch data: {response.text}")
            return jsonify({'error': 'Failed to fetch data'}), response.status_code

        return jsonify(data.to_dict(orient='records'))
    except Exception as e:
        print(f"Failed to get data: {str(e.with_traceback())}")
        return jsonify({'error': str(e)}), 500 