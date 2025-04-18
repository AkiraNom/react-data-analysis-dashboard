import { memo, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrencyMililon } from '../../utils/formatters';

interface BarChartProps<T> {
  data: T[];
  dataKeys: Array<keyof T>;
  colors: string[];
  labels: string[];
  xAxisDataKey? : keyof T;
  yAxisFormatter?: (value: number| string) => string;
  tooltipFormatter?: (value: number | string ) => string;
}

function BarChartComponent<T> ({
  data,
  dataKeys,
  colors,
  labels,
  xAxisDataKey = "name" as keyof T,
  yAxisFormatter = formatCurrencyMililon,
  tooltipFormatter = formatCurrencyMililon
}: BarChartProps<T>) {

  const bars = useMemo(() => {
    return dataKeys.map((key, index) => (
      <Bar
        key={String(key)}
        dataKey={key as string}
        fill={colors[index]}
        name={labels[index]}
      />
    ));
  }, [dataKeys, colors, labels]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisDataKey as string}
          tick={{ style: { fontSize: '14px', fontWeight: 'bold', fill: '#333' } }}/>
        <YAxis
          tickFormatter={yAxisFormatter}
          tick={{ style: { fontSize: '14px', fontWeight: 'bold', fill: '#333' } }}/>
        <Tooltip formatter={tooltipFormatter} />
        <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }} />
        {bars}
      </BarChart>
    </ResponsiveContainer>
  );
};

BarChartComponent.displayName = 'BarChartComponent';
const MemoizedBarChart = memo(BarChartComponent) as typeof BarChartComponent;

export default MemoizedBarChart;
