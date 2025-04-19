import sqlite3

import pandas as pd
import pycountry
from geopy.geocoders import Nominatim

csv_path = "./data/data.csv"
df = pd.read_csv(csv_path)

df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

region_df = df[["Country", "Country_Int"]].drop_duplicates().rename(columns={"Country_Int": "RegionID"})
customer_df = df[["Customer_Int", "Country_Int"]].drop_duplicates().rename(columns={"Customer_Int" : "CustomerID","Country_Int": "RegionID"})
product_df = df[["Category_Int", "Description", "UnitPrice", "UnitCost"]].drop_duplicates().rename(columns={"Category_Int": "ProductID"})
invoice_df = df[["InvoiceNo", "InvoiceDate", "Category_Int", "Customer_Int", "Quantity"]].drop_duplicates()
invoice_df = invoice_df.rename(columns={"InvoiceNo": "InvoiceID", "Category_Int": "ProductID", "Customer_Int": "CustomerID"})

region_df = region_df.rename(columns={"Country_Int": "RegionID", "Country": "Country"})
country_list = region_df["Country"].unique().tolist()

# initialize geolocator
geolocator = Nominatim(user_agent="my_app")

for country in country_list:
    try:
        country_obj = pycountry.countries.lookup(country)
        location = geolocator.geocode(country)
        region_df.loc[region_df["Country"] == country, ["CountryISO-alpha3", "Latitude", "Longitude"]] = country_obj.alpha_3, location.latitude, location.longitude
    except LookupError:
        print(f"Country '{country}' not found in pycountry.")
        # Assign 'UNK' for unknown countries and coordinates of 0.0, 0.0
        region_df.loc[region_df["Country"] == country, ["CountryISO-alpha3", "Latitude", "Longitude"]] = 'UNK', 0.0, 0.0

region_records = [(int(row["RegionID"]), str(row["Country"]), str(row["CountryISO-alpha3"]), float(row["Latitude"]), float(row["Longitude"])) for _, row in region_df.iterrows()]

# Prepare customer records
customer_df = customer_df.rename(columns={"CustomerID": "CustomerID", "Country_Int": "RegionID"})
customer_df = customer_df.drop_duplicates(subset="CustomerID")
customer_df['CustomerID'] = customer_df['CustomerID'].astype('int')
customer_records = [(int(row["CustomerID"]), int(row["RegionID"])) for _, row in customer_df.iterrows()]

# Prepare product records
product_df = product_df.rename(columns={"Category_Int": "ProductID"})
product_df = product_df.drop_duplicates(subset="ProductID")
product_records = [
    (int(row["ProductID"]), str(row["Description"]), float(row["UnitPrice"]), float(row["UnitCost"]))
    for _, row in product_df.iterrows()
]

# Prepare invoice records
invoice_df = invoice_df.rename(columns={"InvoiceNo": "InvoiceID", "InvoiceDate": "InvoiceDate"})
invoice_records = [
    (
        str(row["InvoiceID"]),
        str(row["InvoiceDate"]),
        int(row["ProductID"]),
        int(row["CustomerID"]),
        int(row["Quantity"]),
    )
    for _, row in invoice_df.iterrows()
]

# Connect to SQLite and create tables
conn = sqlite3.connect("../db/sales_data.db")
cursor = conn.cursor()

# Enable foreign keys
cursor.execute("PRAGMA foreign_keys = ON;")

# Create tables
cursor.executescript("""
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS region;

CREATE TABLE region (
    id INTEGER PRIMARY KEY,
    country TEXT NOT NULL,
    country_iso_alpha3 TEXT NOT NULL,
    latitude REAL,
    longitude REAL
);

CREATE TABLE customer (
    id INTEGER PRIMARY KEY,
    region_id INTEGER,
    FOREIGN KEY (region_id) REFERENCES region(id)
);

CREATE TABLE product (
    id INTEGER PRIMARY KEY,
    description TEXT,
    unitprice REAL,
    unitcost REAL
);

CREATE TABLE invoice (
    invoice_line_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    invoice_date TEXT,
    product_id INTEGER,
    customer_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);
""")

# Insert data into tables
cursor.executemany("INSERT INTO region (id, country, country_iso_alpha3, latitude, longitude) VALUES (?, ?, ?, ?, ?);", region_records)
cursor.executemany("INSERT INTO customer (id, region_id) VALUES (?, ?);", customer_records)
cursor.executemany("INSERT INTO product (id, description, unitprice, unitcost) VALUES (?, ?, ?, ?);", product_records)
cursor.executemany("INSERT INTO invoice (invoice_id, invoice_date, product_id, customer_id, quantity) VALUES (?, ?, ?, ?, ?);", invoice_records)

# Commit and close
conn.commit()
conn.close()

print("Database created successfully.")

