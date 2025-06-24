import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './icons'; // MoonIcon is cloud placeholder

export const CornerWidget: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000); 
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-50 bg-slate-800/60 backdrop-blur-lg p-2.5 sm:p-3 rounded-lg shadow-xl border border-slate-700/60 text-slate-200">
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <span className="font-mono text-lg sm:text-xl text-cyan-300">{time}</span>
        <div className="flex space-x-1">
          <SunIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
          <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-300" /> {/* Cloud placeholder */}
        </div>
      </div>
      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
        <span>Sunny</span> <span className="text-slate-500">|</span> <span>24°C</span>
      </div>
    </div>
  );
};
