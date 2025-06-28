import React from 'react';
import SecondRow from './SecondRow';
import { useNavigate } from 'react-router-dom';

const OEEGauge = ({ value }) => {
  const percentage = parseFloat(value) || 0;
  const radius = 80;
  const circumference = Math.PI * radius;
  const dashoffset = ((100 - percentage) / 100) * circumference;
  const needleRotation = percentage * 1.8 ; // Maps 0-100 to -90 to 90 degrees
  const getColor = (value) => {
    if (value >= 80) return "#1BBD31";
    if (value >= 60) return "#fdeb47";
    return "#ff7b47";
  };

  const gaugeColor = getColor(percentage);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="-100 -100 200 200"> {/* Increased viewBox from -80 -80 160 160 */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gaugeColor} stopOpacity="0.1"/>
            <stop offset="100%" stopColor={gaugeColor} stopOpacity="0.05"/>
          </linearGradient>
        </defs>

        {/* Background arc - adjusted radius from 60 to 80 */}
        <path
          d="M -80 0 A 80 80 0 0 1 80 0"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Filled arc - adjusted radius from 60 to 80 */}
        <path
          d="M -80 0 A 80 80 0 0 1 80 0"
          fill="none"
          stroke={gaugeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          className="transition-all duration-1000 ease-in-out"
        />

         {/* Needle Base Circle */}
         <circle 
          cx="0" 
          cy="0" 
          r="8" 
          fill="#374151"
          className="transition-all duration-300"
        />

        {/* Needle */}
        <g transform={`rotate(${needleRotation})`} className="transition-transform duration-700">
          <path
            d="M -60 0 L 0 -3 L 0 3 Z"
            fill="#374151"
          />
        </g>

         {/* Tick marks */}
         <g>
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = -90 + (tick * 1.8);
            const rad = angle * Math.PI / 180;
            const x1 = Math.cos(rad) * 70;
            const y1 = Math.sin(rad) * 70;
            const x2 = Math.cos(rad) * 80;
            const y2 = Math.sin(rad) * 80;
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#e5e7eb"
                strokeWidth="2"
              />
            );
          })}
        </g>
      </svg>

      {/* Center text - adjusted position */}
      <div 
        className="absolute flex flex-col items-center" 
        style={{ transform: 'translateY(21px)' }}
      >
        <div className="text-2xl font-bold" style={{ color: gaugeColor }}>
          {percentage}%
        </div>
        <div className="text-[10px] text-gray-500">OEE</div>
      </div>

      {/* Bottom ticks - adjusted position */}
      <div className="absolute -bottom-2 w-full flex justify-between px-6 text-[10px] text-gray-400"> {/* Adjusted spacing and font size */}
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
};

const FirstRow = () => {

  const getPartColor = (partNumber) => {
    return partNumber === '9253020232' ? '#5506D6' : '#00B2FF';
  };
  
  const [selectedPart, setSelectedPart] = React.useState({
    number: '9253020232',
    name: 'BIG CYLINDER'
  });

  const parts = [
    { number: '9253020232', name: 'BIG CYLINDER' },
    { number: '9253010242', name: 'SMALL CYLINDER' }
  ];

  const [oeeData, setOeeData] = React.useState({
    availability: '0',
    performance: '0',
    quality: '0',
    oee: '0'
  });

  const [isLoading, setIsLoading] = React.useState(true);

  // Add fetch function
  const fetchOEEData = async () => {
    try {
      const response = await fetch('https://oee-backend-1.onrender.com//api/oee');
      const result = await response.json();
      if (result.success) {
        setOeeData({
          availability: result.data.availability.replace('%', ''),
          performance: result.data.performance.replace('%', ''),
          quality: result.data.quality.replace('%', ''),
          oee: result.data.oee.replace('%', '')
        });
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching OEE data:', err);
      setIsLoading(false);
    }
  };


   // Add useEffect for data fetching
   React.useEffect(() => {
    fetchOEEData();
    const intervalId = setInterval(fetchOEEData, 20000); // Refresh every 20 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Replace the original part name and number divs with these components
  const PartNameCard = () => (
    <div className="bg-[#0BD4E5]-50 h-[164px] border border-gray-200 rounded-lg shadow-md hover:shadow-[0_0_1px_#fff,inset_0_0_2px_#fff,0_0_1px_#0BD4E5,0_0_3px_#08f,0_0_9px_#0BD4E5] transition-all duration-300 overflow-hidden group hover:border-[#0BD4E5]">
      <div className="border-b border-[#143D60] py-3 px-3 flex items-center justify-between bg-gradient-to-r from-white to-cyan-50" 
           style={{ borderColor: getPartColor(selectedPart.number) }}>
        <span className="text-s font-medium" style={{ color: getPartColor(selectedPart.number) }}>PART NAME</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" style={{ color: getPartColor(selectedPart.number) }} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="py-4 px-3 group-hover:bg-cyan-50 transition-colors">
        <div className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: getPartColor(selectedPart.number) }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-lg text-gray-800 font-bold">{selectedPart.name}</span>
        </div>
        <div className="text-xs text-center text-gray-500 mt-1">Manufacturing Part</div>
      </div>
    </div>
  );


  const PartNumberCard = () => (
    <div className="bg-[#0BD4E5]-50 h-[164px] border border-gray-200 rounded-lg shadow-md hover:shadow-[0_0_1px_#fff,inset_0_0_2px_#fff,0_0_1px_#0BD4E5,0_0_3px_#08f,0_0_9px_#0BD4E5] transition-all duration-300 overflow-visible group hover:border-[#0BD4E5] relative">
      <div className="border-b py-3 px-3 flex items-center justify-between bg-gradient-to-r from-white to-cyan-100"
           style={{ borderColor: getPartColor(selectedPart.number) }}>
        <span className="text-s font-medium" style={{ color: getPartColor(selectedPart.number) }}>PART NUMBER</span>
        <button 
          onClick={() => document.getElementById('partDropdown').classList.toggle('hidden')}
          className="focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" style={{ color: getPartColor(selectedPart.number) }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      
      <div className="py-4 px-3 group-hover:bg-cyan-50 transition-colors">
        <div className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: getPartColor(selectedPart.number) }} viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span className="text-lg text-gray-800 font-bold">{selectedPart.number}</span>
        </div>
        <div className="text-xs text-center text-gray-500 mt-1">Serial Number</div>
      </div>
  
      {/* Dropdown Menu */}
      <div 
        id="partDropdown" 
        className="hidden absolute top-[100%] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1"
        style={{ minWidth: '100%' }}
      >
        {parts.map(part => (
          <div
            key={part.number}
            className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm border-b last:border-b-0"
            onClick={() => {
              setSelectedPart(part);
              document.getElementById('partDropdown').classList.add('hidden');
            }}
          >
            {part.number}
          </div>
        ))}
      </div>
    </div>
  );



  const MetricCard = ({ title, value, trend, prevValue, isLoading }) => {
    const getColor = (title, value) => {
      const numValue = parseFloat(value);
      switch(title) {
        case 'AVAILABILITY':
          return numValue >= 90 ? '#1BBD31' : '#FF4747';
        case 'PERFORMANCE':
          return numValue >= 75 ? '#1BBD31' : '#FF4747';
        case 'QUALITY':
          return numValue >= 70 ? '#1BBD31' : '#FF4747';
        default:
          return '#E97451';
      }
    };

    const navigate = useNavigate();
  
    const color = getColor(title, value);
    const isPositive = parseFloat(trend) >= 0;

    // Update handleClick to use navigate instead of window.location
    const handleClick = () => {
      if (title === 'AVAILABILITY') {
        navigate('/availability');
      } else if (title === 'QUALITY') {
        navigate('/quality');
      }
    };
    
    // Add cursor and hover styles for clickable cards
    const isClickable = title === 'AVAILABILITY' || title === 'QUALITY';
    const cardClasses = `bg-[#0BD4E5]-50 p-2 h-full border border-gray-200 rounded-lg shadow-md hover:shadow-[0_0_1px_#fff,inset_0_0_2px_#fff,0_0_1px_#0BD4E5,0_0_3px_#08f,0_0_9px_#0BD4E5] transition-all duration-300 hover:border-[#0BD4E5] ${
      isClickable ? 'cursor-pointer hover:border-[#0BD4E5]' : ''
    }`;

  
    return (
      <div 
        className={cardClasses}
        onClick={isClickable ? handleClick : undefined}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3 bg-[#143D60] rounded-full"></div>
            <span className="text-[#143D60] text-xs font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
            <span className="text-[9px] text-gray-500">Live</span>
          </div>
        </div>
  
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color }}>{value}%</span>
                <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
{/*                   ({Math.abs(parseFloat(trend))}% {isPositive ? '▲' : '▼'}) */}
                </span>
              </div>
{/*               <span className="text-[10px] text-gray-500">{prevValue}</span> */}
            </div>
  
            <div className="mt-2">
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${value}%`,
                    backgroundColor: color,
                    opacity: 0.8
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="text-[9px] text-gray-500">Current</span>
                </div>
                <div className="flex items-center gap-1">
                  {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  <span className="text-[9px] text-gray-500">Target</span> */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-12 gap-3">
        {/* Part Info Section */}
       
        <div className="col-span-4 grid grid-cols-2 gap-2">
          <PartNameCard />
          <PartNumberCard />
        </div>
        

        {/* OEE Gauge */}
        <div className="col-span-2">
          <div className="bg-white p-2 h-[164px] border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="px-2 flex items-center justify-between">
              <span className="text-[#143D60] text-xs font-medium">OEE</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] text-gray-500">Live</span>
              </div>
            </div>
            <div className="py-2 px-2">
              <div className="relative h-[100px] flex items-center justify-center">
                <OEEGauge value={oeeData.oee} />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="col-span-6">
        <div className="grid grid-cols-3 gap-3 h-[138x]">
          <div className="w-full border border-gray-200 rounded-lg shadow-sm">
            <MetricCard 
              title="AVAILABILITY"
              value={oeeData.availability}
              trend="(+10% ▲)"
              prevValue="vs prev 11.6K"
              isLoading={isLoading}
            />
          </div>
          <div className="w-full border border-gray-200 rounded-lg shadow-sm">
            <MetricCard 
              title="PERFORMANCE"
              value={oeeData.performance}
              trend="(+10% ▲)"
              prevValue="vs prev 11.6K"
              isLoading={isLoading}
            />
          </div>
          <div className="w-full border border-gray-200 rounded-lg shadow-sm">
            <MetricCard 
              title="QUALITY"
              value={oeeData.quality}
              trend="(+10% ▲)"
              prevValue="vs prev 11.6K"
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      </div>
      <div className="mt-2">
        <SecondRow selectedPart={selectedPart} />
      </div>
    </div>
  )
}

export default FirstRow;
