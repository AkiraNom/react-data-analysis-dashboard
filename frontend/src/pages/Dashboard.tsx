import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DashboardHeader from '../components/layout/DashboardHeader';
import DashboardTabs from '../components/layout/DashboardTabs';
import MetricsSection from '../components/metrics/MetricsSection';
import OverviewPanel from '../components/panels/OverviewPanel';
import SQLQueryPanel from '../components/panels/SQLQueryPanel';
import { Data } from '../components/types/data';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [monthlyResponse, countriesResponse, productsResponse, metricsResponse, mapResponse] = await Promise.all([
        axios.get('/api/monthly-data'),
        axios.get('/api/countries-data'),
        axios.get('/api/products-data'),
        axios.get('/api/metrics'),
        axios.get('/api/map-data')
      ]);
      setData({
        monthlyData: monthlyResponse.data,
        countriesData: countriesResponse.data,
        productsData: productsResponse.data,
        metricsData: metricsResponse.data,
        mapData: mapResponse.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  },[]);

  const currentMetrics = useMemo(() => {
    return data?.metricsData || {
      total_sales: 0,
      total_profits: 0,
      profit_margin: 0,
      average_order_value: 0
    };
  }, [data?.metricsData]);

  if (loading || !data) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sales Performance</h2>
          </div>
          <MetricsSection metricsData={currentMetrics} />
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <DashboardTabs activeTab={activeTab} setActiveTab={handleTabChange} />

            {activeTab === 'overview' ? (
              <OverviewPanel
                monthlyData={data.monthlyData}
                countriesData={data.countriesData}
                productsData={data.productsData}
                mapData={data.mapData}
              />
            ) : (
              <SQLQueryPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
