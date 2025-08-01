import React, { useState, useEffect } from 'react';
import FirstRowqual from './FirstRowqual';
import Paro from './ParatoQual';

const Quality = () => {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPart, setSelectedPart] = useState({
    number: '9253010242',
    name: 'BIG CYLINDER'
  });


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://oee-backend-1.onrender.com/api/monthly-stats');
        const data = await response.json();
        
        if (data.success) {
          // Process stats to remove zero counts
          const processedData = {
            ...data.data,
            stats: Object.fromEntries(
              Object.entries(data.data.stats).map(([part, partData]) => [
                part,
                {
                  ...partData,
                  rejectionsByReason: partData.rejectionsByReason.filter(
                    rejection => rejection.count > 0
                  )
                }
              ])
            )
          };
          setStatsData(processedData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 20000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-2 md:p-4">
        <FirstRowqual 
          statsData={statsData} 
          onPartSelect={setSelectedPart} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Paro 
            statsData={statsData} 
            selectedPart={selectedPart}
          />
        </div>
      </div>
    </div>
  );
};

export default Quality;
