import { memo } from 'react';
import { MonthlyData } from '../types/data';
import BarChartComponent from './BarChartComponent';
import LineChartComponent from './LineChartComponent';

interface SalesChartSectionProps {
  monthlyData: MonthlyData[];
}

const SalesChartSection: React.FC<SalesChartSectionProps> = memo(({ monthlyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-base font-medium text-gray-800 mb-4">Monthly Sales & Profit</h3>
        <div className="h-80">
          <BarChartComponent<MonthlyData>
            data={monthlyData}
            dataKeys={['sales', 'profits']}
            colors={['#3b82f6', '#10b981']}
            labels={['Sales', 'Profits']}
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-base font-medium text-gray-800 mb-4">Sales Trend</h3>
        <div className="h-80">
          <LineChartComponent<MonthlyData>
            data={monthlyData}
            dataKeys={['sales', 'profits']}
            colors={['#3b82f6', '#10b981']}
            labels={['Sales', 'Profit']}
          />
        </div>
      </div>
    </div>
  );
});

SalesChartSection.displayName = 'SalesChartSection';

export default SalesChartSection;
