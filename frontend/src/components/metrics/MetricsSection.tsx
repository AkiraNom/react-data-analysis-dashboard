import { TrendingUp } from 'lucide-react';
import React, { memo, useEffect } from 'react';
import { formatCurrency, formatCurrencyMililon } from '../../utils/formatters';
import type { MetricsData } from '../types/data';
import MetricCard from './MetricCard';

interface MetricsSectionProps {
  metricsData: MetricsData;
}

const MetricsSection: React.FC<MetricsSectionProps> = memo(({ metricsData }) => {
  useEffect(() => {
  }, [metricsData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Sales"
        value={formatCurrencyMililon(metricsData.total_sales)}
        icon={<TrendingUp size={20} className="text-blue-500" />}
      />
      <MetricCard
        title="Total Profit"
        value={formatCurrencyMililon(metricsData.total_profits)}
        icon={<TrendingUp size={20} className="text-green-500" />}
      />
      <MetricCard
        title="Profit Margin"
        value={`${(metricsData.profit_margin*100).toFixed(2)}%`}
        icon={<TrendingUp size={20} className="text-purple-500" />}
      />
      <MetricCard
        title="Average Order Value"
        value={formatCurrency(metricsData.average_order_value)}
        icon={<TrendingUp size={20} className="text-yellow-500" />}
      />
    </div>
  );
});

MetricsSection.displayName = 'MetricsSection';

export default MetricsSection;
