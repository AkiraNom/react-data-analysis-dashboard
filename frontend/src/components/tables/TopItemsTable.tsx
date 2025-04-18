import { memo, useCallback, useMemo, useState } from 'react';
import { formatCurrencyThousand } from '../../utils/formatters';
import ItemLimiter from '../common/ItemLimiter';
import { CountryData, ProductData } from '../types/data';

interface TopItemsTableProps {
  data: (CountryData | ProductData)[];
  title: string;
}

const TopItemsTable: React.FC<TopItemsTableProps> = memo(({ data, title }) => {
  const [itemLimit, setItemLimit] = useState(6);
  const [sortBy, setSortBy] = useState<string>('sales'); // Default sort by sales
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  }, [sortBy]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      // For string values (name)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const aNum = Number(aValue);
      const bNum = Number(bValue);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }
      return 0;
    });
  }, [data, sortBy, sortOrder]);

  const displayData = useMemo(() => {
    return sortedData.slice(0, itemLimit);
  }, [sortedData, itemLimit]);

  const handleItemLimitChange = useCallback((newLimit: number) => {
    setItemLimit(newLimit);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <ItemLimiter
          itemLimit={itemLimit}
          setItemLimit={handleItemLimitChange}
          minLimit={5}
          maxLimit={20}
          step={1}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  sortBy === 'name' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th
                onClick={() => handleSort('sales')}
                className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  sortBy === 'sales' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                Sales {sortBy === 'sales' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th
                onClick={() => handleSort('profits')}
                className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  sortBy === 'profits' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                Profits {sortBy === 'profits' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((item) => (
              <tr key={item.name} className="hover:bg-gray-50">
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-600">{formatCurrencyThousand(item.sales)}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-600">{formatCurrencyThousand(item.profits)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 text-sm text-gray-500 text-right">
        Showing {Math.min(itemLimit, sortedData.length)} of {sortedData.length} items
      </div>
    </div>
  );
});

TopItemsTable.displayName = 'TopItemsTable';

export default TopItemsTable;
