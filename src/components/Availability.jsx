import React, { useState, useEffect } from 'react';
import FirstRowPareto from './FirstRowPareto';
import ParatoSection from './ParatoSection';

const Availability = () => {
  const [runtimeData, setRuntimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRuntimeData = async () => {
      try {
        const response = await fetch('https://oee-backend-1.onrender.com/api/monthly-runtime');
        const data = await response.json();
        if (data.success) {
          setRuntimeData(data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching runtime data:', error);
        setIsLoading(false);
      }
    };

    fetchRuntimeData();
    const interval = setInterval(fetchRuntimeData, 20000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <FirstRowPareto runtimeData={runtimeData} />
        <div className="grid grid-cols-2 gap-6 mt-6">
          <ParatoSection runtimeData={runtimeData} />
        </div>
      </div>
    </div>
  );
};

export default Availability;