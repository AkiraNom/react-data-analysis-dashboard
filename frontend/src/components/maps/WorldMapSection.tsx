import 'leaflet/dist/leaflet.css';
import { memo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { CountryData } from '../types/data';
import RadiusLayer from './layers/RadiusLayer';

interface WorldMapSectionProps {
  data: CountryData[];
}

const WorldMapSection: React.FC<WorldMapSectionProps> = memo(({ data }) => {
  const [mapKey] = useState(0);
  const colorMap = { sales: "#3b82f6" };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Global Sales Map</h3>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        key={mapKey}
        center={[20, 0] as [number, number]}
        zoom={2}
        style={{ height: "400px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* radius layer*/}
        <RadiusLayer data={data} metric="sales" colorMap={colorMap} />
      </MapContainer>
    </div>
  );
});

WorldMapSection.displayName = 'WorldMapSection';

export default WorldMapSection;
