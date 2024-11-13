from app import app
from flask import render_template, request, jsonify
import pandas as pd
import os

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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/datasets', methods=['GET'])
def get_datasets():
    return jsonify(list(datasets.keys()))

@app.route('/get_columns', methods=['POST'])
def get_columns():
    try:
        dataset_name = request.json.get('dataset')
        
        if not dataset_name:
            return jsonify({'error': 'Dataset name is required'}), 400

        if dataset_name in datasets:
            columns = list(datasets[dataset_name].columns)
            print(f"Columns: {columns}")
            return jsonify(columns)
        return jsonify({'error': f"Dataset '{dataset_name}' not found"}), 404
    except Exception as e:
        print(f"Failed to get columns: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/get_data', methods=['POST'])
def get_data():
    try:
        dataset_name = request.json.get('dataset')
        columns = request.json.get('columns', [])
        filters = request.json.get('filters', {})

        print(f"Dataset: {dataset_name}, Columns: {columns}, Filters: {filters}")

        if not dataset_name:
            return jsonify({'error': 'Dataset name is required'}), 400

        if dataset_name not in datasets:
            return jsonify({'error': f"Dataset '{dataset_name}' not found"}), 404

        data = datasets[dataset_name]

        # Apply filters with operators
        for column, condition in filters.items():
            if column in data.columns:
                operator = condition.get('operator')
                value = condition.get('value')
                column_dtype = data[column].dtype

                if pd.api.types.is_numeric_dtype(column_dtype):
                    value = float(value)  # Convert to float for numeric comparisons
                    if operator == 'greater_than':
                        data = data[data[column] > value]
                    elif operator == 'less_than':
                        data = data[data[column] < value]
                    elif operator == 'equals':
                        data = data[data[column] == value]
                elif pd.api.types.is_string_dtype(column_dtype):
                    if operator == 'equals':
                        data = data[data[column] == value]
                    else:  # Default to contains
                        data = data[data[column].astype(str).str.contains(value, na=False)]

        # Return the filtered data with all columns
        return jsonify(data.to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500