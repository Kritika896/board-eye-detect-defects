
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DetectedDefect } from '@/pages/Index';

interface DefectChartProps {
  defects: DetectedDefect[];
}

const DefectChart: React.FC<DefectChartProps> = ({ defects }) => {
  // Process data for charts
  const defectCounts = defects.reduce((acc, defect) => {
    const type = defect.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(defectCounts).map(([type, count]) => ({
    type,
    count,
    confidence: Math.round(
      defects
        .filter(d => d.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) === type)
        .reduce((sum, d) => sum + d.confidence, 0) / count * 100
    )
  }));

  const pieChartData = barChartData.map((item, index) => ({
    ...item,
    fill: `hsl(${index * 60}, 70%, 50%)`
  }));

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
    confidence: {
      label: "Avg Confidence",
      color: "hsl(var(--chart-2))",
    },
  };

  const severityData = [
    {
      level: 'Critical',
      count: defects.filter(d => ['short', 'open_circuit'].includes(d.type)).length,
      fill: '#ef4444'
    },
    {
      level: 'High',
      count: defects.filter(d => ['spurious_copper', 'spur'].includes(d.type)).length,
      fill: '#f97316'
    },
    {
      level: 'Medium',
      count: defects.filter(d => ['mouse_bite', 'missing_hole'].includes(d.type)).length,
      fill: '#eab308'
    }
  ].filter(item => item.count > 0);

  if (defects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Defect Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-500 py-8">
            <p>No defects detected - Charts will appear after analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Defect Count Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Defect Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={barChartData}>
              <XAxis 
                dataKey="type" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  value,
                  name === 'count' ? 'Defects Found' : 'Avg Confidence (%)'
                ]}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Severity Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ level, count }) => `${level}: ${count}`}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [value, 'Count']}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Confidence Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {defects.map((defect) => (
              <div key={defect.id} className="flex items-center justify-between text-sm">
                <span className="capitalize">
                  {defect.type.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${defect.confidence * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-medium">
                    {Math.round(defect.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefectChart;
