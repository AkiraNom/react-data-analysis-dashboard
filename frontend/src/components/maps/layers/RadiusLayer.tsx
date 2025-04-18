import { memo } from 'react';
import { CircleMarker, Popup } from 'react-leaflet';
import { formatCurrencyThousand } from '../../../utils/formatters';
import { CountryData } from '../../types/data';

interface RadiusLayerProps {
  data: CountryData[];
  metric: keyof Pick<CountryData, 'sales' | 'profits'>;
  colorMap: Record<string, string>;
}

const RadiusLayer: React.FC<RadiusLayerProps> = memo(({ data, metric, colorMap }) => {
  return (
    <>
      {data.map((country) => (
        <CircleMarker
          key={country.name}
          center={[country.latitude, country.longitude]}
          radius={Math.log(country[metric]) * 0.8 }
          pathOptions={{
            fillColor: colorMap[metric],
            fillOpacity: 0.6,
            weight: 0,
          }}
        >
          <Popup>
            <div className="font-medium">
              <strong>{country.name}</strong>
              <br />
              metric : {formatCurrencyThousand(country[metric])}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
});

RadiusLayer.displayName = 'RadiusLayer';

export default RadiusLayer;
