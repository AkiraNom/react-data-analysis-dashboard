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
            (p.unitprice - p.unitcost)  * inv.quantity as profit
        FROM invoice inv
        JOIN customer c on  (inv.customer_id = c.id)
        JOIN region r on (c.region_id = r.id)
        JOIN product p on (inv.product_id = p.id)
    """
    df = pd.read_sql(query, conn)
    return df
