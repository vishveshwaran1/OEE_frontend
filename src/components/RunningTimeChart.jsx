import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell, ComposedChart } from 'recharts'
import { LineChart, Line, Legend } from 'recharts';
import { useState, useEffect } from 'react'

function RunningTimeChart() {
  const [chartData, setChartData] = useState([]);
  const [planActualData, setPlanActualData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const threshold = 106;

  const formatPlanActualData = (data) => {
    return data.map(item => {
        const dateObj = new Date(item.date);
        const day = dateObj.getDate();
        const shiftFormatted = item.shift === 'shift-1' ? 'S1' : item.shift === 'shift-2' ? 'S2' : item.shift;
        return {
            name: `|${day}-${shiftFormatted}|`,
            plan: item.plan,
            actual: item.actual,
            month: dateObj.toLocaleString('default', { month: 'short' }) // new field
        };
    });
};

  // Function to process hourly data
  const processHourlyData = (hourlyProduction) => {
    // Create a map to store hourly totals
    const hourlyTotals = new Map();
  
    // Process data for each part type (BIG CYLINDER and SMALL CYLINDER)
    Object.entries(hourlyProduction).forEach(([partType, timeEntries]) => {
      // Group and sum entries by hour
      Object.entries(timeEntries).forEach(([timeStr, count]) => {
        const hour = timeStr.split(':')[0];
        hourlyTotals.set(hour, (hourlyTotals.get(hour) || 0) + count);
      });
    });
  
    // Convert to array format for chart and pad with missing hours
    const data = [];
    
    // Add entries from 8 to 23
  for (let i = 8; i <= 23; i++) {
    const hour = i.toString().padStart(2, '0');
    data.push({
      hour,
      value: hourlyTotals.get(hour) || 0
    });
  }

  // Add entries from 0 to 7
  for (let i = 0; i <= 7; i++) {
    const hour = i.toString().padStart(2, '0');
    data.push({
      hour,
      value: hourlyTotals.get(hour) || 0
    });
  }
  
    return data;
  };

  // Fetch data function
  const fetchData = async () => {
    try {
      const [productionResponse, planActualResponse] = await Promise.all([
        fetch('https://oee-backend-eta.vercel.app/api/hourly-production-data'),
        fetch('https://oee-backend-eta.vercel.app/api/recent-plan-actual')
      ]);

      const productionData = await productionResponse.json();
      const planActualData = await planActualResponse.json();
      
      if (productionData.success) {
        const processedData = processHourlyData(productionData.hourlyProduction);
        setChartData(processedData);
      }

      if (planActualData.success) {
        const processedPlanActual = formatPlanActualData(planActualData.data);
        setPlanActualData(processedPlanActual);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    <div className="px-4">
      <div className="flex gap-4">
      {/* Running Time Chart */}
      <div className="w-[70%] bg-white p-2 h-[195px] border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#143D60] text-xs font-medium">RUNNING TIME</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FFA318]"></div>
              <span className="text-xs text-gray-500">Above Threshold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF470D]"></div>
              <span className="text-xs text-gray-500">Below Threshold</span>
            </div>
          </div>
        </div>

        <div className="h-[140px] -mt-1 overflow-hidden">
            <BarChart 
              width={1000} // Changed from 1200 to 900
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
                    fill={entry.value >= threshold ? '#16a34a' : '#FFA318'}
                  />
                ))
              }
            </Bar>
          </BarChart>
          </div>
        </div>

        {/* Plan vs Actual Chart - 25% width */}
        <div className="w-[30%] bg-white p-2 h-[195px] border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#143D60] text-xs font-medium">PLAN VS ACTUAL</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
                <span className="text-xs text-gray-500">Plan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FFA928]"></div>
                <span className="text-xs text-gray-500">Actual</span>
              </div>
            </div>
          </div>

          <div className="h-[140px] mt-1">
              <ComposedChart
                width={400}
                height={140}
                data={planActualData}
                margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tickSize={0}
                  height={25}
                  axisLine={{ stroke: '#000000' }}
                  tick={{ fontSize: 10, fill: '#000000' }}
                  tickLine={false}
                />
                <YAxis
                  tickSize={0}
                  width={30}
                  axisLine={{ stroke: '#000000' }}
                  tick={{ fontSize: 11, fill: '#000000' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
                <Bar 
                  dataKey="plan"
                  fill="#2563eb"
                  barSize={30}
                />
                <Line 
                  type="monotone"
                  dataKey="actual"
                  stroke="#FFA928"
                  strokeWidth={2}
                  dot={{ fill: '#FFA928', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </div>
            {/* Month overall label */}
            <div className="text-center text-xs text-gray-700">
              {planActualData.length > 0 && planActualData[0].month}
            </div>
        </div>
      </div>
    </div>
  )
} 

export default RunningTimeChart
