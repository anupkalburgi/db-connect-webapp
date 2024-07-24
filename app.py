
from databricks.connect import DatabricksSession
from flask import Flask, render_template, jsonify
from pyspark.sql.functions import month
from pyspark.sql.functions import col, count, lit

import time
app = Flask(__name__)


# cluster_id = "0709-160529-hzm0y3mq"
# c = Config(profile="e2-demo-field-eng", cluster_id=cluster_id)


spark = DatabricksSession.builder.serverless().getOrCreate()

print(spark.range(1).collect())


# Load and validate data
# file_path = "/Users/anup.kalburgi/code/db-connect-ey/sales_data_with_order_id.csv"
file_path = "/Volumes/anupk/workflows/baby_names/sales_data_with_order_id.csv"
data = spark.read.csv(file_path, header=True)
# data = pd.read_csv(file_path)

# Sample validation function
def validate_data(df):
    # Count total rows for later use
    total_rows = df.count()
    missing_values_list = []
    
    for column in df.columns:
        non_null_count = df.agg(count(col(column)).alias('non_null_count')).collect()[0]['non_null_count']
        missing_values = total_rows - non_null_count
        missing_values_list.append((column, missing_values))
    missing_values_df = spark.createDataFrame(missing_values_list, ["Column", "MissingValues"])
    return missing_values_df

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/step1')
def step1():
    validation_results = validate_data(data)
    return jsonify({'status': 'success', 'data': validation_results.toPandas().to_html(classes='data')})

@app.route('/step2')
def step2():
    # Aggregation by Product
    product_aggregation = data.groupby('Product').count()
    return jsonify({'status': 'success', 'data': product_aggregation.toPandas().to_html(classes='data')})

@app.route('/step3')
def step3():
    # Aggregation by Region (zipcode)
    region_aggregation = data.groupBy('Zipcode').count()
    return jsonify({'status': 'success', 'data': region_aggregation.toPandas().to_html(classes='data')})

@app.route('/step4')
def step4():
    time.sleep(5)
    # Aggregation by Price
    price_aggregation = data.groupBy('Order ID').count()
    return jsonify({'status': 'success', 'data': price_aggregation.toPandas().to_html(classes='data')})

@app.route('/step5')
def step5():
    time.sleep(5)
    # Aggregation by Month
    month_aggregation = data.groupBy(month("Date").alias("Month")).count()
    return jsonify({'status': 'success', 'data': month_aggregation.toPandas().to_html(classes='data')})

if __name__ == '__main__':
    app.run(debug=True, port=3050)
