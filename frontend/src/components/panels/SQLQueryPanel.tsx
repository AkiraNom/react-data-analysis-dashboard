import axios from 'axios';
import { Database, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ERDiagram from '../query/ERDiagram';
import QueryTable from '../query/QueryTable';
import QueryTextArea from '../query/QueryTextArea';
import { QueryResult, SQLQueryPanelProps } from '../types/data';

const defaultQuery = `SELECT * FROM invoice
JOIN customer ON invoice.customer_id = customer.id
JOIN region ON customer.region_id = region.id
WHERE region.country_iso_alpha3 = 'GBR'
LIMIT 10;`;

const SQLQueryPanel: React.FC<SQLQueryPanelProps> = () => {
  const [showERDiagram, setShowERDiagram] = useState(false);
  const [query, setQuery] = useState(defaultQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [queryResults, setQueryResults] = useState<QueryResult[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const handleRunQuery = async () => {
    setIsLoading(true);
    setQueryError(null);
    try {
      const response = await axios.post('/api/query-data', { query });
      setQueryResults(response.data);

      const jsonString = JSON.stringify(response.data)
      const sizeInBytes = new Blob([jsonString]).size;
      const maxSize = 4.8 * 1024 * 1024 // sessionStorage upto 5MB

      if (sizeInBytes < maxSize) {
        sessionStorage.setItem('sqlQueryResults', jsonString);
        sessionStorage.setItem('sqlQuery', query);
        console.log(`Saved results to sessionStorage (${(sizeInBytes / 1024).toFixed(2)} KB)`);
      } else {
        sessionStorage.setItem('sqlQuery', query);
        console.warn(`Query result too large to store (${(sizeInBytes / 1024 / 1024).toFixed(2)} MB), skipping sessionStorage.`);
        sessionStorage.removeItem('sqlQueryResults');
      }
    } catch (error: any) {
      setQueryError(error?.response?.data?.message || 'Failed to execute query');
      console.error("Query error:", error);
      setQueryResults(null);
      sessionStorage.removeItem('sqlQueryResults');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuery(defaultQuery);
    setQueryResults(null);
    setQueryError(null);
    sessionStorage.removeItem('sqlQueryResults');
    sessionStorage.removeItem('sqlQuery');
  };

  useEffect(() => {
    const savedResults = sessionStorage.getItem('sqlQueryResults');
    const savedQuery = sessionStorage.getItem('sqlQuery');
    if (savedResults) setQueryResults(JSON.parse(savedResults));
    if (savedQuery) setQuery(savedQuery);
  }, []);

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-medium text-gray-800">Custom SQL Query</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowERDiagram(prev => !prev)}
              className="px-4 py-1 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-600 flex items-center"
            >
              {showERDiagram ? 'Hide ER Diagram' : 'Show ER Diagram'}
            </button>
            <button
              onClick={handleRunQuery}
              disabled={isLoading}
              className="px-4 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <Database size={16} className="mr-1" />
              {isLoading ? 'Running....' : 'Run Query'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 flex items-center"
            >
              <RotateCcw size={16} className="mr-1" />
              Reset
            </button>
          </div>
        </div>
        <div className="p-4">
          {showERDiagram && (
            <div className="mt-4">
              <ERDiagram />
            </div>
          )}
          <QueryTextArea query={query} setQuery={setQuery} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">Query Results</h3>
        {queryError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-medium">Error executing query:</p>
            <p>{queryError}</p>
          </div>
        )}
        {queryResults && queryResults.length > 0 ? (
          <QueryTable data={queryResults} />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
            {isLoading ? 'Running query...' : 'Run a query to see results here'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SQLQueryPanel;
