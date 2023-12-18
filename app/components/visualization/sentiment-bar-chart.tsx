import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

type SentimentBarChartProps = {
  data: { name: string; value: number }[];
};

export function SentimentBarChart({ data }: SentimentBarChartProps) {
  return (
    <ResponsiveContainer height='100%' width={225}>
      <BarChart data={data} id='bar-chart'>
        <XAxis dataKey='name' />
        <YAxis interval={1} />
        <Bar dataKey='value' fill='#E11D48' />
      </BarChart>
    </ResponsiveContainer>
  );
}
