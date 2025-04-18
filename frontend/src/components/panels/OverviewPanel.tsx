import React, { memo } from 'react';
import SalesChartSection from '../charts/SalesChartSection';
import WorldMapSection from '../maps/WorldMapSection';
import TopItemsTable from '../tables/TopItemsTable';
import type { CountryData, MonthlyData, ProductData } from '../types/data';

interface OverviewPanelProps {
  monthlyData: MonthlyData[];
  countriesData: CountryData[];
  productsData: ProductData[];
}

const OverviewPanel: React.FC<OverviewPanelProps> = memo(({ monthlyData, countriesData, productsData }) => {
  return (
    <div className="p-4">
      <SalesChartSection monthlyData={monthlyData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <WorldMapSection data={countriesData} />

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopItemsTable data={countriesData} title="Top Countries" />
          <TopItemsTable data={productsData} title="Top Products" />
        </div>
      </div>
    </div>
  );
});

OverviewPanel.displayName = 'OverviewPanel';

export default OverviewPanel;
