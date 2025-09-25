import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell, ComposedChart, ResponsiveContainer } from 'recharts'
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
    const hourlyTotals = new Map();
    Object.entries(hourlyProduction).forEach(([partType, timeEntries]) => {
      Object.entries(timeEntries).forEach(([timeStr, count]) => {
        const hour = timeStr.split(':')[0];
        hourlyTotals.set(hour, (hourlyTotals.get(hour) || 0) + count);
      });
    });
    const data = [];
    for (let i = 8; i <= 23; i++) {
      const hour = i.toString().padStart(2, '0');
      const value = Math.max(0, hourlyTotals.get(hour) || 0); // Ensure no negative
      data.push({
        hour,
        value
      });
    }
    for (let i = 0; i <= 7; i++) {
      const hour = i.toString().padStart(2, '0');
      const value = Math.max(0, hourlyTotals.get(hour) || 0); // Ensure no negative
      data.push({
        hour,
        value
      });
    }
    return data;
  };

  // Fetch data function
  const fetchData = async () => {
    try {
      const [productionResponse, planActualResponse] = await Promise.all([
        fetch('http://localhost:3000/api/hourly-production-data'),
        fetch('http://localhost:3000/api/recent-plan-actual')
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
    const intervalId = setInterval(fetchData, 20000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 py-2 flex items-center justify-center h-[220px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#143D60]"></div>
        <span className="ml-4 text-[#143D60] font-semibold">Loading charts...</span>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex flex-col gap-8 md:flex-row md:gap-6">
        {/* Running Time Chart */}
        <div className="md:w-[70%] w-full bg-white p-4 min-h-[260px] border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-auto mb-4 md:mb-0">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#143D60] text-base font-bold truncate">Running Time (Hourly)</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#16a34a] border border-gray-300"></div>
                <span className="text-xs text-gray-600">Above Threshold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FFA318] border border-gray-300"></div>
                <span className="text-xs text-gray-600">Below Threshold</span>
              </div>
            </div>
          </div>
          <div className="h-[180px] -mt-1 overflow-x-auto">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart 
                data={chartData}
                margin={{ top: 10, right: 10, left: 30, bottom: 25 }}
                barGap={2}
                barSize={30}
                baseValue={0}
              >   
                <XAxis 
                  dataKey="hour" 
                  tickSize={0}
                  height={30}
                  axisLine={{ stroke: '#666' }}
                  tick={{ fontSize: 12, fill: '#143D60', fontWeight: 500 }}
                  tickLine={false}
                  dy={8}
                  scale="band"
                  padding={{ left: 5, right: 5 }}
                  label={{ value: 'Hour', position: 'insideBottom', offset: -5, fill: '#143D60', fontSize: 13 }}
                />
                <YAxis 
                  domain={[0, Math.max(120, threshold * 1.5)]}
                  tickSize={0}
                  width={35}
                  axisLine={{ stroke: '#666' }}
                  tick={{ fontSize: 12, fill: '#143D60', fontWeight: 500 }}
                  tickLine={false}
                  label={{ value: 'Parts', angle: -90, position: 'insideLeft', fill: '#143D60', fontSize: 13 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6', opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                  formatter={(value) => [`Total: ${value}`, 'Parts']}
                  labelFormatter={(label) => `Hour: ${label}`}
                />
                <ReferenceLine 
                  y={threshold} 
                  stroke="#8B4513" 
                  strokeDasharray="3 3" 
                  strokeWidth={2}
                  label={{
                    value: `Threshold: ${threshold}`,
                    fill: '#8B4513',
                    fontSize: 11,
                    position: 'right'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[6, 6, 0, 0]}
                  minPointSize={0}
                  maxBarSize={40}
                  isAnimationActive={true}
                >
                  {
                    chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.value >= threshold 
                          ? 'url(#aboveThresholdGradient)' 
                          : 'url(#belowThresholdGradient)'}
                      />
                    ))
                  }
                </Bar>
                <defs>
                  <linearGradient id="aboveThresholdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#a7f3d0" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="belowThresholdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFA318" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#fde68a" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan vs Actual Chart */}
        <div className="md:w-[30%] w-full bg-white p-4 min-h-[260px] border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#143D60] text-base font-bold truncate">Plan vs Actual</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#2563eb] border border-gray-300"></div>
                <span className="text-xs text-gray-600">Plan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FFA928] border border-gray-300"></div>
                <span className="text-xs text-gray-600">Actual</span>
              </div>
            </div>
          </div>
          <div className="h-[180px] mt-1 overflow-x-auto">
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart
                data={planActualData}
                margin={{ top: 10, right: 10, left: 20, bottom: 25 }}
              >
                <XAxis
                  dataKey="name"
                  tickSize={0}
                  height={30}
                  axisLine={{ stroke: '#143D60' }}
                  tick={{ fontSize: 12, fill: '#143D60', fontWeight: 500 }}
                  tickLine={false}
                  label={{ value: 'Day-Shift', position: 'insideBottom', offset: -5, fill: '#143D60', fontSize: 13 }}
                />
                <YAxis
                  tickSize={0}
                  width={35}
                  axisLine={{ stroke: '#143D60' }}
                  tick={{ fontSize: 12, fill: '#143D60', fontWeight: 500 }}
                  tickLine={false}
                  label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#143D60', fontSize: 13 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                  formatter={(value, name) => [`${value}`, name === 'plan' ? 'Plan' : 'Actual']}
                  labelFormatter={(label) => `Day-Shift: ${label}`}
                />
                <Bar 
                  dataKey="plan"
                  fill="url(#planGradient)"
                  barSize={20}
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={true}
                />
                <Line 
                  type="monotone"
                  dataKey="actual"
                  stroke="#FFA928"
                  strokeWidth={3}
                  dot={{ fill: '#FFA928', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <defs>
                  <linearGradient id="planGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-gray-700 mt-2 font-semibold truncate">
            {planActualData.length > 0 && `Month: ${planActualData[0].month}`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RunningTimeChart
