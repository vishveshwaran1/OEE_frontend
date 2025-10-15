import React, { useState, useEffect } from 'react';
import FirstRow from './FirstRow';
import ParatoSection from './ParatoSection';

const Availability = () => {
  const [runtimeData, setRuntimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRuntimeData = async () => {
      try {
        setError(null);
        const response = await fetch('https://oee-backend-1.onrender.com/api/monthly-runtime');
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data && data.success) {
          setRuntimeData(data.data);
        } else {
          throw new Error('Unexpected API response');
        }
      } catch (err) {
        console.error('Error fetching runtime data:', err);
        setError('Failed to load runtime data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRuntimeData();
    const interval = setInterval(fetchRuntimeData, 20000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[#143D60]">
          <svg className="animate-spin h-5 w-5 text-[#6C2DD2]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="font-medium">Loading runtime data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FirstRow runtimeData={runtimeData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ParatoSection runtimeData={runtimeData} />
      </div>
    </div>
  );
};

export default Availability;