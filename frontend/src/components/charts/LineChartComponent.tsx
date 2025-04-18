import { memo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrencyMililon } from '../../utils/formatters';
import CustomLegend from './CustomLegend';

interface LineChartProps<T> {
  data: T[];
  dataKeys: Array<keyof T>;
  colors: string[];
  labels: string[];
  xAxisDataKey?: keyof T;
  yAxisFormatter?: (value: number | string) => string;
  tooltipFormatter?: (value: number | string) => string;
}

function LineChartComponent<T>({
  data,
  dataKeys,
  colors,
  labels,
  xAxisDataKey = "name" as keyof T,
  yAxisFormatter = formatCurrencyMililon,
  tooltipFormatter = formatCurrencyMililon,
}: LineChartProps<T>) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisDataKey as string}
          tick={{ style: { fontSize: '14px', fontWeight: 'bold', fill: '#333' } }}
        />
        <YAxis
          tickFormatter={yAxisFormatter}
          tick={{ style: { fontSize: '14px', fontWeight: 'bold', fill: '#333' } }}
        />
        <Tooltip formatter={tooltipFormatter} labelFormatter={(value) => `${value}`}/>
        <Legend content={CustomLegend} />

        {dataKeys.map((key, index) => (
          <Line
            key={String(key)}
            type="monotone"
            dataKey={key as string}
            stroke={colors[index]}
            strokeWidth={3}
            name={labels[index]}
            dot={{ r: 4, strokeWidth: 1 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

const MemoizedLineChart = memo(LineChartComponent) as typeof LineChartComponent;
LineChartComponent.displayName = 'LineChartComponent';

export default MemoizedLineChart;
