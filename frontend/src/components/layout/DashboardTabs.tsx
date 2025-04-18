interface DashboardTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }

  const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
      return (
        <div className="p-4 border-b border-gray-100">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'query' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('query')}
            >
              SQL Query
            </button>
          </div>
        </div>
      );
    };

    export default DashboardTabs;
