import React from 'react';

interface Props {
  query: string;
  setQuery: (val: string) => void;
}

const QueryTextArea: React.FC<Props> = ({ query, setQuery }) => (
  <div className="space-y-2 text-sm text-gray-600">
      <div className="p-3 bg-yellow-50 border border-yellow-300 text-yellow-900 rounded-md">
      ⚠️ <b>Caution:</b> If query results are <b>too large</b> to save, switching tabs or refreshing the page will <b>CLEAR</b> the results. (MAX 5MB)
    </div>
    <textarea
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm"
      placeholder="Enter your SQL query"
    />
  </div>
);

export default QueryTextArea;
