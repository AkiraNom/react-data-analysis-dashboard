export interface MetricsData {
  total_sales: number;
  total_profits: number;
  profit_margin: number;
  average_order_value: number;
}

export interface MonthlyData {
  name: string; // month
  month?: string;
  sales: number;
  profits: number;
}

export interface CountryData {
  name: string;
  sales: number;
  profits: number;
  latitude: number;
  longitude: number;
}

export interface ProductData {
  name: string;
  sales: number;
  profits: number;
}

export interface GeoJsonProperties {
  name: string;
  sales?: number;
  'ISO3166-1-Alpha-3'?: string;
  'ISO3166-1-Alpha-2'?: string;
  [key: string]: any;
}

export interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: GeoJsonProperties;
}

export interface GeoJsonData {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}
export interface Data {
  monthlyData: MonthlyData[];
  countriesData: CountryData[];
  productsData: ProductData[];
  metricsData: MetricsData;
  mapData: GeoJsonData;
}

export type Query = string;

export interface QueryResult {
  name: string; // month or date
  [key : string]: string | number; // sales/profits
}

export interface SQLQueryPanelProps {
}
