import { useNavigate } from 'react-router-dom';
import logoMainifa from '../assets/logomainfia.webp';  // Make sure the logo is in this path

import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
    <div className="bg-[#E5FFFC] px-4 py-2 flex justify-between items-center shadow-md border-b border-gray-200">
      {/* Left Section */}
      <div className="flex items-center gap-4">

        {/* Logo Section - replaced upload with actual logo */}
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img 
            src={logoMainifa} 
            alt="Mainifa Logo" 
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-300"></div>

        {/* Title and Description */}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-800">Monitoring Dashboard</h1>
          <p className="text-xs text-gray-500">Notching Machine</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Form Button */}
        <button
          onClick={() => navigate('/form')}
          className="bg-[#6C2DD2] hover:bg-[#974ED1] text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-colors duration-300"
        >
          Form
        </button>

         <button
          onClick={() => navigate('/reports')}
          className="bg-[#6C2DD2] hover:bg-[#974ED1] text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-colors duration-300"
        >
          Report
        </button>

        {/* Current Date and Shift */}
        <div className="bg-[#6C2DD2] text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {`Date: ${currentDate} | ${getCurrentShift()}`}
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#6C2DD2] hover:bg-[#974ED1] text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-colors duration-300"
        >
          Logout
        </button>

      </div>
      
    </div>
  )
}

export default Header 
