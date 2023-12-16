import { Legend, Pie, PieChart } from 'recharts';

type SentimentPieChartProps = {
  data: { name: string; value: number }[];
};

const renderText = (value: string, entry: any) => {
  return (
    <span className='font-medium p-6 text-[#F2F2F2]'>{value}</span>
  );
};

export function SentimentPieChart({ data }: SentimentPieChartProps) {
  return (
    <PieChart width={800} height={400}>
      <Legend
        height={36}
        iconType='circle'
        layout='vertical'
        verticalAlign='middle'
        iconSize={10}
        formatter={renderText}
      />
      <Pie
        data={data}
        cx={120}
        cy={200}
        innerRadius={80}
        outerRadius={100}
        fill='#8884d8'
        paddingAngle={0}
        dataKey='value'
      />
    </PieChart>
  );
}
