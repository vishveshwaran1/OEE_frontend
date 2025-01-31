import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from 'recharts'
import { useState, useEffect } from 'react'

function RunningTimeChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const threshold = 106;

  // Function to process hourly data
   const processHourlyData = (hourlyProduction) => {
    // Create a map to store hourly totals
    const hourlyTotals = new Map();
  
    // Process data for each part type
    Object.values(hourlyProduction).forEach(timeEntries => {
      // Group entries by hour
      const hourlyGroups = {};
      
      Object.entries(timeEntries).forEach(([timeStr, value]) => {
        const hour = timeStr.split(':')[0];
        if (!hourlyGroups[hour]) {
          hourlyGroups[hour] = [];
        }
        hourlyGroups[hour].push(value);
      });
  
      // Calculate production for each hour (delta between max and min)
      Object.entries(hourlyGroups).forEach(([hour, values]) => {
        const hourlyProduction = values.length > 0 
          ? Math.max(...values) - Math.min(...values)
          : 0;
        
        hourlyTotals.set(hour, (hourlyTotals.get(hour) || 0) + hourlyProduction);
      });
    });
  
    // Convert to array format for chart
    return Array.from(hourlyTotals.entries())
      .map(([hour, value]) => ({
        hour,
        value
      }))
      .sort((a, b) => a.hour - b.hour);
  };

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await fetch('https://oee.onrender.com/api/hourly-production-data');
      const data = await response.json();
      
      if (data.success) {
        const processedData = processHourlyData(data.hourlyProduction);
        setChartData(processedData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hourly production data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up interval for polling
    const intervalId = setInterval(fetchData, 20000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <div className="bg-white p-2 h-[180px] border border-gray-200 rounded-lg shadow-md flex items-center justify-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="bg-white p-2 h-[180px] border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#8B4513] text-xs font-medium">RUNNING TIME</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#E97451]"></div>
              <span className="text-xs text-gray-500">Above Threshold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
              <span className="text-xs text-gray-500">Below Threshold</span>
            </div>
          </div>
        </div>

        <div className="h-[140px] -mt-1">
          <BarChart 
            width={1200} 
            height={140} 
            data={chartData}
            margin={{ top: 10, right: 10, left: 30, bottom: 0 }}
            barGap={0}
            barSize={80}
            baseValue={0}
          >
            <XAxis 
              dataKey="hour" 
              tickSize={0}
              height={25}
              axisLine={{ stroke: '#666' }}
              tick={{ fontSize: 11, fill: '#666' }}
              tickLine={false}
              dy={8}
              scale="band"
              padding={{ left: 0, right: 0 }}
            />
             <YAxis 
              domain={[0, Math.max(120, threshold * 1.5)]} // Set fixed maximum that's always above threshold
              tickSize={0}
              width={30}
              axisLine={{ stroke: '#666' }}
              tick={{ fontSize: 11, fill: '#666' }}
              tickLine={false}
              tickFormatter={(value) => value}
            />
            <Tooltip 
              cursor={false}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
              formatter={(value) => [`Total: ${value}`, 'Parts']}
            />
             <ReferenceLine 
              y={threshold} 
              stroke="#8B4513" 
              strokeDasharray="3 3" 
              strokeWidth={1}
              label={{
                value: `Threshold: ${threshold}`,
                fill: '#8B4513',
                fontSize: 10,
                position: 'right'
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 0, 0, 0]}
              minPointSize={0}
              maxBarSize={90}
              isAnimationActive={true}
            >
              {
                chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.value >= threshold ? '#E97451' : '#ef4444'}
                  />
                ))
              }
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  )
}

export default RunningTimeChart
