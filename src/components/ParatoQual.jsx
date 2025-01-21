import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';

const ParatoSection = ({ statsData, selectedPart }) => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (statsData && statsData.stats) {
        setIsLoading(true);
        try {
          let transformedData = [];
          
          if (selectedPart.name === 'ANALYSIS FOR PARTS') {
            // Collect all reasons across parts
            let allReasons = [];
            Object.entries(statsData.stats).forEach(([partName, stats]) => {
              if (stats.rejectionsByReason.length > 0) {
                allReasons = [...allReasons, ...stats.rejectionsByReason];
              }
            });
  
            // Group by reason and sum counts
            const groupedReasons = allReasons.reduce((acc, curr) => {
              acc[curr.reason] = (acc[curr.reason] || 0) + curr.count;
              return acc;
            }, {});
  
            // Convert to array and sort by count
            transformedData = Object.entries(groupedReasons)
              .map(([reason, count]) => ({ name: reason, complaints: count }))
              .sort((a, b) => b.complaints - a.complaints);
  
          } else {
            // Handle single part
            const stats = statsData.stats[selectedPart.name];
            if (stats && stats.rejectionsByReason.length > 0) {
              transformedData = stats.rejectionsByReason
                .map(reason => ({
                  name: reason.reason,
                  complaints: reason.count
                }))
                .sort((a, b) => b.complaints - a.complaints);
            }
          }
  
          // Calculate running total and percentages
          const total = transformedData.reduce((sum, item) => sum + item.complaints, 0);
          let runningTotal = 0;
  
          transformedData = transformedData.map(item => {
            runningTotal += item.complaints;
            return {
              ...item,
              runningTotal,
              pareto: (runningTotal / total * 100).toFixed(1)
            };
          });
  
          setChartData(transformedData);
        } catch (error) {
          console.error('Error processing data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }, [statsData, selectedPart]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

  return (
    <>
      {/* Chart Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        <div className="border-b border-[#8B4513] py-3 px-4 flex items-center justify-between bg-gradient-to-r from-white to-orange-50">
          <span className="text-[#8B4513] text-sm font-medium">COMPLAINTS ANALYSIS</span>
        </div>
        
        <div className="p-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#8B4513' }}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Number of Defects', angle: -90, position: 'insideLeft' }}
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#8B4513' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#8B4513' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E97451',
                  borderRadius: '4px'
                }}
                formatter={(value, name, props) => {
                  if (name === 'complaints') return [`${value} defects`, 'Count'];
                  if (name === 'pareto') return [`${value}%`, 'Cumulative %'];
                  return [value, name];
                }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="complaints" 
                fill="#E97451" 
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="pareto" 
                stroke="#8B4513"
                strokeWidth={2}
                dot={{ fill: '#8B4513', stroke: '#8B4513' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        <div className="border-b border-[#8B4513] py-3 px-4 flex items-center justify-between bg-gradient-to-r from-white to-orange-50">
            <span className="text-[#8B4513] text-sm font-medium">QUALITY ANALYSIS</span>
        </div>
        
        <div className="p-4">
            <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr className="bg-gradient-to-r from-[#8B4513] to-[#E97451] text-white">
                    <th className="px-4 py-3 text-center text-xs font-medium">REJECTED REASONS</th>
                    <th className="px-4 py-3 text-center text-xs font-medium">COUNT</th>
                    <th className="px-4 py-3 text-center text-xs font-medium">PARETO %</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {chartData.map((item, index) => (
                    <tr 
                    key={index}
                    className="hover:bg-orange-50 transition-colors duration-150 border-b border-gray-200"
                    >
                    <td className="px-4 py-3 text-sm text-gray-900 capitalize border-r border-gray-200">
                        {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 text-center">
                        {item.complaints}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">
                        {item.pareto}%
                    </td>
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