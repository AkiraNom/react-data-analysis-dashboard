import 'leaflet/dist/leaflet.css';
import { memo } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import getColor from '../common/ColorScaling';
import { GeoJsonData } from '../types/data';
import LegendBox from './LegendBox';

interface MapSectionProps {
  data: GeoJsonData;
}

const MapSection: React.FC<MapSectionProps> = memo(({ data }) => {

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Global Sales Map</h3>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={[50,0]}
        zoom={4}
        style={{ height: "400px", width: "100%" }}
        scrollWheelZoom={false}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data = {data}
          style={(feature) =>({
            fillColor: getColor(feature?.properties?.sales),
            fillOpacity: 0.7,
            color: '#333',
            weight: 1
          })}
          onEachFeature={(feature, layer) => {
            const name = feature.properties.name;
            const sales = feature.properties.sales?.toLocaleString() ?? "N/A";

            layer.bindTooltip(`${name}: $${sales}`, {
              sticky: true,
              direction: "top",
            });
          }}
          />
      </MapContainer>
      <div className="mt-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">Sales Legend</h4>
        <div className="flex gap-2 text-sm items-center">
          <LegendBox color="#3b82f6" label="> $100K" />
          <LegendBox color="#91a9FA" label="$10K - $100K" />
          <LegendBox color="#E5E9FE" label="< $10K" />
        </div>
      </div>
    </div>
  );
});

MapSection.displayName = 'MapSection';

export default MapSection;
