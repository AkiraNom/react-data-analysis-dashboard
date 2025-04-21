import json
import sqlite3
from datetime import datetime

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils import fetch_sales_data, filter_geojson_by_sales, get_country_data

app = Flask(__name__)
CORS(app, origins='*')

DB_PATH = './db/sales_data.db'
data = fetch_sales_data(DB_PATH)
data['invoice_date'] = pd.to_datetime(data['invoice_date'])

# API Routes
@app.route('/api/monthly-data', methods=['GET'])
def get_monthly_data():

    data['name'] = pd.to_datetime(data['invoice_date']).dt.strftime('%m-%Y')
    monthly_data = data.loc[:, ['name','sales','profits']].groupby(['name']).sum().reset_index()
    result = monthly_data.to_dict(orient='records')

    return jsonify(result)

@app.route('/api/metrics', methods=['GET'])
def get_metrics():

    metrics = {
        'total_sales': int(data['sales'].sum()),
        'total_profits': float(data['profits'].sum()),
        'profit_margin': float(data['profits'].sum() / data['sales'].sum()) if data['sales'].sum() > 0 else 0,
        'average_order_value': float(data.groupby('invoice_id')['sales'].sum().reset_index()['sales'].mean()),
    }

    return jsonify(metrics)

@app.route('/api/countries-data', methods=['GET'])
def get_sales_profit_by_country():

    data_by_country = get_country_data(data)
    sales_profits_by_country = data_by_country.to_dict(orient='records')

    return jsonify(sales_profits_by_country)

@app.route('/api/products-data', methods=['GET'])
def get_product_data():
    data_by_product = data.loc[:, ['description','sales','profits']]\
        .groupby(['description']).sum().reset_index()\
        .rename({'description': 'name'}, axis=1).sort_values(by='sales', ascending=False)

    sales_profits_by_product = data_by_product.to_dict(orient='records')

    return jsonify(sales_profits_by_product)


@app.route('/api/map-data', methods=['GET'])
def map_geojson_with_values():

    with open('./geojson/countries.geojson') as f:
        geojson = json.load(f)

    print("GeoJSON loaded. Getting country data...")
    data_by_country = get_country_data(data).loc[:,['name','sales']]
    sales_map = data_by_country.set_index('name')['sales'].to_dict()

    filtered_geojson = filter_geojson_by_sales(geojson, sales_map)

    return jsonify(filtered_geojson)

@app.route('/api/query-data', methods=['POST'])
def run_sql_query():
    try:
        request_data = request.get_json(force=True)
        query = request_data.get("query")

        if not query:
            return jsonify({"message": "Missing query parameter"}), 400

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute(query)
        rows = cursor.fetchall()
        conn.close()

        results = [dict(row) for row in rows]
        return jsonify(results)

    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

