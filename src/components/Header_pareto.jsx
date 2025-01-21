import React from 'react';
import logoMainfia from '../assets/logomainfia.webp';

const Header_pareto = () => {
  const getCurrentShift = () => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const shift1Start = 8 * 60 + 30; // 8:30 AM
    const shift1End = 19 * 60; // 7:00 PM
    const shift2Start = 20 * 60 + 30; // 8:30 PM
    const shift2End = 7 * 60; // 7:00 AM

    if (currentTime >= shift1Start && currentTime <= shift1End) {
      return 'Shift 1';
    } else if (currentTime >= shift2Start || currentTime <= shift2End) {
      return 'Shift 2';
    } else {
      return 'Shift 2';
    }
  };

  const currentDate = new Date().toLocaleDateString('en-GB');

  return (
    <div className="bg-white px-4 py-2 flex justify-between items-center shadow-md border-b border-[#E97451]">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-1.5">
          <img 
            src={logoMainfia} 
            alt="Mainfia Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-[#E97451] opacity-30"></div>

        {/* Title and Description */}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-800">PARATO PAGE</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-[#8B4513] to-[#E97451] text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {`Date: ${currentDate} | ${getCurrentShift()}`}
        </div>
      </div>
    </div>
  );
};

export default Header_pareto; 