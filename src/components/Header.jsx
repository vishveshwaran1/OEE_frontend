import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoMainifa from '../assets/logomainfia.webp';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [systemOnline, setSystemOnline] = useState(null); // null = unknown, true = online, false = offline
  const [lastCheckedAt, setLastCheckedAt] = useState(null);

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

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      try {
        const response = await fetch('https://oee-backend-1.onrender.com/api/production', {
          method: 'GET',
          signal: controller.signal
        });
        if (!isMounted) return;
        setSystemOnline(response.ok);
      } catch (e) {
        if (!isMounted) return;
        setSystemOnline(false);
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setLastCheckedAt(new Date());
      }
    };

    // initial check and interval
    checkHealth();
    const intervalId = setInterval(checkHealth, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="px-3 py-2 flex flex-row justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')}
          >
            <img
              src={logoMainifa}
              alt="Mainifa Logo"
              className="h-9 w-auto object-contain drop-shadow"
            />
          </div>
          <div className="hidden md:block h-8 w-px bg-gray-300 mx-2"></div>
          <div className="flex flex-col">
            <h1 className="text-base md:text-xl font-extrabold text-[#143D60] tracking-tight">Monitoring Dashboard</h1>
            <p className="text-xs text-[#6C2DD2] font-medium">Notching Machine</p>
          </div>
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden flex items-center p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect y="5" width="24" height="2" rx="1" fill="#143D60"/>
            <rect y="11" width="24" height="2" rx="1" fill="#143D60"/>
            <rect y="17" width="24" height="2" rx="1" fill="#143D60"/>
          </svg>
        </button>

        {/* Right Section */}
        <div className={`flex-col md:flex-row items-center gap-2 md:gap-4 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none border-b md:border-none transition-all duration-300 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
          {/* Live system status */}
          <div className={`flex items-center gap-2 text-xs md:text-sm px-3 py-2 rounded-xl border ${systemOnline === false ? 'bg-red-50 border-red-200 text-red-700' : systemOnline === true ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`} title={lastCheckedAt ? `Last checked: ${lastCheckedAt.toLocaleTimeString()}` : 'Checking status...'}>
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${systemOnline === false ? 'bg-red-500' : systemOnline === true ? 'bg-green-500' : 'bg-gray-400'} animate-[pulse_1.5s_ease-in-out_infinite]`}></span>
            <span className="font-medium">{systemOnline === false ? 'System Offline' : systemOnline === true ? 'System Online' : 'Checking...'}</span>
          </div>
          <button
            onClick={() => { setMenuOpen(false); navigate('/form'); }}
            className="bg-[#6C2DD2] hover:bg-[#974ED1] text-white text-sm px-4 py-2 rounded-xl shadow font-semibold w-full md:w-auto"
          >
            Form
          </button>
          <button
            onClick={() => { setMenuOpen(false); navigate('/reports'); }}
            className="bg-[#6C2DD2] hover:bg-[#974ED1] text-white text-sm px-4 py-2 rounded-xl shadow font-semibold w-full md:w-auto"
          >
            Report
          </button>
          <div className="bg-[#6C2DD2] text-white text-sm px-4 py-2 rounded-xl shadow font-semibold flex items-center gap-2 w-full md:w-auto justify-center">
            <span className="material-icons text-base">calendar_today</span>
            {`Date: ${currentDate} | ${getCurrentShift()}`}
          </div>
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="bg-[#6C2DD2] hover:bg-[#974ED1] text-white text-sm px-4 py-2 rounded-xl shadow font-semibold w-full md:w-auto"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
