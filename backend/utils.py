import sqlite3

import pandas as pd


def fetch_sales_data(db_path)-> pd.DataFrame:

    conn = sqlite3.connect(db_path)

    query = """
        SELECT
            inv.invoice_id,
            inv.invoice_date,
            inv.quantity,
            r.country,
            r.country_iso_alpha3,
            r.latitude,
            r.longitude,
            p.description,
            p.unitprice,
            p.unitcost,
            inv.quantity * p.unitprice as sales,
            (p.unitprice - p.unitcost)  * inv.quantity as profits
        FROM invoice inv
        JOIN customer c on  (inv.customer_id = c.id)
        JOIN region r on (c.region_id = r.id)
        JOIN product p on (inv.product_id = p.id)
    """
    df = pd.read_sql(query, conn)
    return df

def get_country_data(data):
    filtered_data = data[data['country_iso_alpha3'] != 'UNK'].copy()
    data_by_country = filtered_data.loc[:, ['country','latitude', 'longitude', 'sales', 'profits']]\
        .groupby(['country', 'latitude', 'longitude']).sum().reset_index()\
        .rename({'country': 'name'}, axis=1).sort_values(by='sales', ascending=False)

    return data_by_country

def filter_geojson_by_sales(geojson_data, sales_map):
    filtered_features = []

    for feature in geojson_data["features"]:
        country_name = feature["properties"].get("name")
        if country_name in sales_map:
            feature["properties"]["sales"] = sales_map[country_name]
            filtered_features.append(feature)

    return {
        "type": "FeatureCollection",
        "features": filtered_features
    }
