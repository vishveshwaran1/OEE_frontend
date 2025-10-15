import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';

const ParatoSection = ({ runtimeData }) => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (runtimeData && runtimeData.stats) {
        const { stoppagesByReason } = runtimeData.stats;
        
        // Sort by duration in descending order
        const sortedData = [...stoppagesByReason].sort((a, b) => b.duration - a.duration);
        
        // Calculate total duration
        const totalDuration = sortedData.reduce((sum, item) => sum + item.duration, 0);
        
        // Calculate cumulative percentages
        let runningTotal = 0;
        const transformedData = sortedData.map(item => {
          runningTotal += item.duration;
          return {
            name: item.reason,
            complaints: item.duration,
            occurrences: item.occurrences,
            pareto: (runningTotal / totalDuration * 100).toFixed(1)
          };
        });
  
        setChartData(transformedData);
        setIsLoading(false);
      }
    }, [runtimeData]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <>
        {/* Chart Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="border-b border-[#143D60] py-3 px-4 flex items-center justify-between bg-gradient-to-r from-white to-cyan-50">
            <span className="text-[#143D60] text-sm font-medium">STOPPAGE ANALYSIS</span>
          </div>
          
          <div className="p-4 h-[300px] overflow-x-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#143D60' }}
                />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Stoppage Duration (min)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#143D60' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#143D60' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #143D60',
                    borderRadius: '4px'
                  }}
                  formatter={(value, name) => {
                    if (name === 'complaints') return [`${value} min`, 'Duration'];
                    if (name === 'pareto') return [`${value}%`, 'Cumulative %'];
                    return [value, name];
                  }}
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="complaints" 
                  fill="#143D60" 
                  radius={[4, 4, 0, 0]}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="pareto" 
                  stroke="#143D60"
                  strokeWidth={2}
                  dot={{ fill: '#143D60', stroke: '#143D60' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="border-b border-[#143D60] py-3 px-4 flex items-center justify-between bg-gradient-to-r from-white to-orange-50">
            <span className="text-[#143D60] text-sm font-medium">STOPPAGE ANALYSIS</span>
          </div>
          
          <div className="p-4">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead>
                  <tr className="bg-gradient-to-r from-[#143D60] to-[#6C2DD2] text-white">
                    <th className="px-4 py-3 text-center text-xs font-medium w-1/2">STOPPAGE REASON</th>
                    <th className="px-4 py-3 text-center text-xs font-medium w-1/4">DURATION (min)</th>
                    <th className="px-4 py-3 text-center text-xs font-medium w-1/4">CUMULATIVE %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {chartData.map((item, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-orange-50 transition-colors duration-150 border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize border-r border-gray-200 break-words">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 text-center">{item.complaints}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.pareto}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
};

export default ParatoSection;
