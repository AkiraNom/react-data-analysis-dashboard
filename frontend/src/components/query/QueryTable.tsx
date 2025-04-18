import { Download } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface Props {
  data: Record<string, any>[];
}

const QueryTable: React.FC<Props> = ({ data }) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const headers = Object.keys(data[0] || {});

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortAsc]);

  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const exportToCSV = () => {
    const csv = [headers.join(',')].concat(
      data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'query_results.csv');
    link.click();
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          onClick={exportToCSV}
          className="flex items-center text-sm px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
        >
          <Download size={16} className="mr-1" /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase font-semibold">
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {key}
                  {sortKey === key ? (sortAsc ? ' 🔼' : ' 🔽') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedData.map((row, i) => (
              <tr key={i}>
                {headers.map((key) => (
                  <td key={key} className="px-4 py-2 whitespace-nowrap">
                    {typeof row[key] === 'number' ? row[key].toFixed(2) : row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, data.length)} of {data.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryTable;
