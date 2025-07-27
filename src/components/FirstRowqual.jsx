import React, { useEffect, useState } from 'react';

const FirstRow = ({ statsData, onPartSelect }) => { // Add onPartSelect prop
    const [selectedPart, setSelectedPart] = useState({
      number: '9253010242',
      name: 'BIG CYLINDER'
    });
  
    // Update the part selection handler
    const handlePartSelect = (part) => {
      setSelectedPart(part);
      onPartSelect(part); // Pass selected part up to parent
      document.getElementById('partDropdown').classList.add('hidden');
    };
  

  const [counts, setCounts] = useState({
    good: 0,
    rejected: 0
  });

  const parts = [
    { number: '9253020232', name: 'BIG CYLINDER' },
    { number: '9253010242', name: 'SMALL CYLINDER' },
    { number: 'Both', name: 'ANALYSIS FOR PARTS' }
  ];


  useEffect(() => {
    console.log(statsData)
    if (statsData && statsData.stats) {
      if (selectedPart.name === 'ANALYSIS FOR PARTS') {
        // Sum up counts for all parts
        const totals = Object.values(statsData.stats).reduce((acc, curr) => ({
          good: acc.good + curr.goodCount,
          rejected: acc.rejected + curr.totalRejections
        }), { good: 0, rejected: 0 });
        console.log("toatl:", totals);
        setCounts(totals);
      } else {
        // Get counts for selected part
        const partStats = statsData.stats[selectedPart.name];
        if (partStats) {
          setCounts({
            good: partStats.goodCount,
            rejected: partStats.totalRejections
          });
        }
      }
    }
  }, [selectedPart, statsData]);

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Part Info Section */}
        <PartNameCard />
        <PartNumberCard />

        {/* Count Cards */}
        <GoodCountCard 
          value={counts.good.toString()}
          prevValue="Previous Period"
        />
        <DefectedCountCard 
          value={counts.rejected.toString()}
          prevValue="Previous Period"
        />
      </div>
    </div>
  );

  // --- Card Components ---

  const PartNameCard = () => (
    <div className="bg-white h-[164px] border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:border-[#0BD4E5]">
      <div className="border-b border-[#143D60] py-3 px-3 flex items-center justify-between bg-gradient-to-r from-white to-cyan-50">
        <span className="text-[#143D60] text-sm font-semibold tracking-wide">PART NAME</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#143D60] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <div className="py-4 px-3 group-hover:bg-cyan-50 transition-colors">
        <div className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#143D60]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <ellipse cx="12" cy="5" rx="8" ry="3" strokeWidth="2"/>
            <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" strokeWidth="2"/>
          </svg>
          <span className="text-lg text-gray-800 font-bold">{selectedPart.name}</span>
        </div>
        <div className="text-xs text-center text-gray-500 mt-1">Manufacturing Part</div>
      </div>
    </div>
  );

  const PartNumberCard = () => (
    <div className="bg-white h-[164px] border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-visible group hover:border-[#0BD4E5] relative">
      <div className="border-b border-[#143D60] py-3 px-3 flex items-center justify-between bg-gradient-to-r from-white to-cyan-50">
        <span className="text-[#143D60] text-sm font-semibold tracking-wide">PART NUMBER</span>
      </div>
      <div className="py-4 px-3">
        <div 
          onClick={() => document.getElementById('partDropdown').classList.toggle('hidden')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-[#1676C9] transition-colors flex items-center justify-between bg-white"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1676C9]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
              <path d="M9 8h6m-6 4h6m-6 4h6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-lg text-gray-800 font-bold">{selectedPart.number}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1676C9]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="text-xs text-center text-gray-500 mt-2">Serial Number</div>
      </div>
      {/* Dropdown Menu */}
      <div 
        id="partDropdown" 
        className="hidden absolute top-[60%] left-3 right-3 bg-white border border-[#143D60] rounded-md shadow-lg z-50 mt-1"
      >
        {parts.map(part => (
          <div
            key={part.number}
            className="px-4 py-2.5 hover:bg-cyan-50 cursor-pointer text-sm border-b last:border-b-0 flex items-center gap-2"
            onClick={() => handlePartSelect(part)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#143D60]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
              <path d="M8 12h8m-4-4v8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{part.number}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const DefectedCountCard = ({ value, prevValue }) => (
    <div className="bg-white h-[164px] border-2 border-red-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -mr-10 -mt-10 z-0" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-50 rounded-full -ml-8 -mb-8 z-0" />
      <div className="relative z-10 h-full">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <span className="text-red-500 text-sm font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              REJECTED COUNT
            </span>
          </div>
          <div className="flex flex-col mt-auto">
            <span className="text-3xl font-bold text-red-500">{value}</span>
            <span className="text-sm text-gray-500 mt-1">vs prev = {prevValue}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const GoodCountCard = ({ value, prevValue }) => (
    <div className="bg-gradient-to-br from-white to-green-50 h-[164px] border border-green-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <span className="text-green-600 text-sm font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            GOOD COUNT
          </span>
        </div>
        <div className="flex-1 flex items-end">
          <div className="w-full">
            <span className="text-3xl font-bold text-green-600">{value}</span>
            <span className="text-sm text-gray-500 mt-1">vs prev = {prevValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstRow;
