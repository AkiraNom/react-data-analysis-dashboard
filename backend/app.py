import sqlite3

from flask import Flask, jsonify, request
from flask_cors import CORS
from utils import fetch_sales_data

app = Flask(__name__)
CORS(app, origins='*')

db_path = './db/sales_data.db'
data = fetch_sales_data(db_path)

@app.route('/api/countries', methods=['GET'])
def get_countries():

    country_list = sorted(data['country'].unique().tolist()) # unique countries alphabetical order

    return jsonify({'countries':country_list})

# API Routes
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
def get_country_data():
    filtered_data = data[data['country_iso_alpha3'] != 'UNK'].copy()
    data_by_country = filtered_data.loc[:, ['country','latitude', 'longitude', 'sales', 'profits']]\
        .groupby(['country', 'latitude', 'longitude']).sum().reset_index()\
        .rename({'country': 'name'}, axis=1).sort_values(by='sales', ascending=False)

    sales_profits_by_country = data_by_country.to_dict(orient='records')

    return jsonify(sales_profits_by_country)

@app.route('/api/products-data', methods=['GET'])
def get_product_data():
    data_by_product = data.loc[:, ['description','sales','profits']]\
        .groupby(['description']).sum().reset_index()\
        .rename({'description': 'name'}, axis=1).sort_values(by='sales', ascending=False)

    sales_profits_by_product = data_by_product.to_dict(orient='records')

    return jsonify(sales_profits_by_product)

@app.route('/api/monthly-data', methods=['GET'])
def get_monthly_data():

    data['name'] = data['invoice_date'].dt.strftime('%m-%Y')
    monthly_data = data.loc[:, ['name','sales','profits']].groupby(['name']).sum().reset_index()

    result = monthly_data.to_dict(orient='records')

    return jsonify(result)

@app.route('/api/query-data', methods=['POST'])
def run_sql_query():
    try:
        request_data = request.get_json(force=True)
        query = request_data.get("query")

        if not query:
            return jsonify({"message": "Missing query parameter"}), 400

        db_path = 'sales_data.db'
        conn = sqlite3.connect(db_path)
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

