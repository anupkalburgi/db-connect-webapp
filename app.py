# app.py
from flask import Flask, render_template, request, session, redirect, url_for
from flask_session import Session
import pandas as pd
import uuid
import sqlite3
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go
import plotly.utils
import json
from databricks.connect import DatabricksSession
from pyspark.sql.functions import mean

spark = DatabricksSession.builder.serverless().getOrCreate()

app = Flask(__name__)
app.config["SECRET_KEY"] = "your_secret_key"  # Replace with a real secret key
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_FILE_DIR"] = "./flask_session"

Session(app)


# Database initialization
def init_db():
    conn = sqlite3.connect("user_data.db")
    c = conn.cursor()
    c.execute(
        """CREATE TABLE IF NOT EXISTS users
                 (id TEXT PRIMARY KEY, file_path TEXT, created_at DATETIME)"""
    )
    conn.commit()
    conn.close()


init_db()


def get_db_connection():
    conn = sqlite3.connect("user_data.db")
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def index():
    if "user_id" not in session:
        session["user_id"] = str(uuid.uuid4())
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO users (id, created_at) VALUES (?, ?)",
            (session["user_id"], datetime.now()),
        )
        conn.commit()
        conn.close()
    return render_template("index.html")


@app.route("/step1", methods=["GET", "POST"])
def step1():
    if request.method == "POST":
        file_path = request.form["file_path"]
        conn = get_db_connection()
        conn.execute(
            "UPDATE users SET file_path = ? WHERE id = ?",
            (file_path, session["user_id"]),
        )
        conn.commit()
        conn.close()
        return redirect(url_for("step2"))
    return render_template("step1.html")


@app.route("/step2")
def step2():
    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE id = ?", (session["user_id"],)
    ).fetchone()
    conn.close()

    if not user["file_path"]:
        return redirect(url_for("step1"))

    # Validate file path (simplified example)
    # if not os.path.exists(user["file_path"]):
    #     return render_template("step2.html", error="File not found")

    # Read data (assuming CSV for this example)
    try:
        df = spark.read.csv(user["file_path"], header=True, inferSchema=True)
        session["columns"] = df.columns
        return redirect(url_for("step3"))
    except Exception as e:
        return render_template("step2.html", error=str(e))


@app.route("/step3")
def step3():
    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE id = ?", (session["user_id"],)
    ).fetchone()
    conn.close()

    if not user["file_path"]:
        return redirect(url_for("step1"))

    # df = pd.read_csv(user["file_path"])
    df = spark.read.csv(user["file_path"], header=True, inferSchema=True)
    df = df.toPandas()

    # Perform initial aggregation (e.g., mean of all numeric columns)
    agg_result = df.select_dtypes(include=["int64", "float64"]).mean()

    return render_template("step3.html", agg_result=agg_result.to_dict())

@app.route("/step4", methods=["GET", "POST"])
def step4():
    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE id = ?", (session["user_id"],)
    ).fetchone()
    conn.close()

    if not user["file_path"]:
        return redirect(url_for("step1"))

    # df = pd.read_csv(user["file_path"])
    df = spark.read.csv(user["file_path"], header=True, inferSchema=True)
    df = df.toPandas()
    columns = df.columns.tolist()

    # Assume the first column is the date column
    date_column = columns[0]
    df[date_column] = pd.to_datetime(df[date_column])

    if request.method == "POST":
        selected_columns = request.form.getlist("selected_columns")
        chart_type = request.form.get("chart_type")

        if not selected_columns:
            return render_template(
                "step4.html", columns=columns, error="Please select at least one column"
            )

        if chart_type == "line":
            fig = px.line(
                df, x=date_column, y=selected_columns, title="Time Series Line Chart"
            )
        elif chart_type == "scatter":
            fig = px.scatter(
                df, x=date_column, y=selected_columns, title="Time Series Scatter Plot"
            )
        else:  # Default to line chart
            fig = px.line(
                df, x=date_column, y=selected_columns, title="Time Series Line Chart"
            )

        chart_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return render_template("step4.html", columns=columns, chart_json=chart_json)

    return render_template("step4.html", columns=columns)


if __name__ == "__main__":
    app.run(debug=True)
