import React from 'react';
import { QrCodeIcon, StarIcon } from './icons/index';

export const FuturisticIdCard: React.FC = () => {
  return (
    <div
      className="relative w-full max-w-[80px] sm:max-w-[88px] aspect-[100/145] mx-auto group" // Adjusted aspect ratio
    >
      {/* Card Background and Shape Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-950 to-slate-900 rounded-lg shadow-2xl overflow-hidden">

        {/* Top extended tab shape */}
        <div className="absolute top-0 left-0 w-[60%] h-[12%] bg-slate-700/80 rounded-tr-md rounded-bl-sm clip-path-polygon-[0%_0%,_100%_0%,_100%_70%,_80%_100%,_0%_100%]">
          <div className="absolute top-1/2 left-3 -translate-y-1/2 flex space-x-1">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-slate-500/70 rounded-full"></div>
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-slate-500/70 rounded-full"></div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[30%] h-[6%] bg-slate-700/80 rounded-bl-md"></div>


        {/* Main Portrait Area with Lavender Glow */}
        <div className="absolute top-[6%] left-[4%] w-[68%] h-[62%] rounded-md overflow-hidden">
          <img
            src="https://picsum.photos/seed/useravatarTyra/200/280"
            alt="User Profile"
            className="w-full h-full object-cover object-center"
          />
          {/* Soft blue/purple gradient overlay for photo background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-600/20 to-transparent mix-blend-color-dodge"></div>
        </div>
        {/* Lavender light strip */}
        <div className="absolute top-[6%] left-[calc(4%+68%+1px)] w-[1.5px] sm:w-[2px] h-[62%] bg-purple-400/90 rounded-full shadow-[0_0_4px_1px_theme(colors.purple.400),0_0_8px_2px_theme(colors.purple.500)]"></div>
        <div className="absolute top-[6%] left-[3.5%] w-[calc(68%+1.5px)] h-[62%] rounded-md border-l-2 border-t-2 border-purple-500/30 opacity-70 box-border"></div>


        {/* QR Code and Holo Sticker */}
        <div className="absolute top-[8%] left-[6%] space-y-0.5 sm:space-y-1 z-10">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white p-0.5 rounded-sm shadow-md border border-slate-300">
            <QrCodeIcon className="w-full h-full text-black" />
          </div>
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm shadow-md border border-slate-400/50
                         bg-gradient-to-br from-slate-200 via-slate-400 to-slate-300
                         bg-[length:200%_200%] animate-shimmer opacity-80 flex items-center justify-center">
              <div className="w-[70%] h-[70%] bg-slate-500/30 pattern-crosshatch pattern-slate-600/50 pattern-bg-transparent pattern-size-1"></div>
          </div>
        </div>

        {/* Right Vertical Text Strip */}
        <div className="absolute top-[6%] right-[3%] w-[22%] h-[62%] bg-slate-800/50 rounded-md p-0.5 sm:p-1 flex flex-col justify-between items-center text-center">
          <StarIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-purple-400/70 filter drop-shadow-[0_0_2px_theme(colors.purple.400)] opacity-70 mt-px" />
          <div className="writing-mode-vertical-rl transform rotate-180 space-y-1 sm:space-y-1.5 flex-grow flex flex-col justify-center items-center my-1">
            {[
              {label: "ID NUMBER", value: "T-140110101"},
              {label: "ADDRESS", value: "32'07'N 118'W"},
              {label: "ISSUE DATE", value: "2022.11.25"},
              {label: "EXPIRED DATE", value: "2278.MAR.30"},
            ].map(item => (
              <div key={item.label} className="leading-none">
                <p className="text-[3px] sm:text-[4px] font-medium text-slate-400/80 uppercase tracking-tighter">{item.label}</p>
                <p className="text-[4px] sm:text-[5px] font-semibold text-white tracking-tightest">{item.value}</p>
              </div>
            ))}
          </div>
           <div className="w-full h-px bg-purple-500/30 mt-0.5"></div>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-[2%] left-[4%] right-[3%] h-[27%]">
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-purple-600/30"></div>
          <div className="absolute top-1 left-0 w-1/2 h-px bg-purple-600/20"></div>
          <div className="absolute top-1 right-0 w-1/3 h-px bg-purple-600/20"></div>

          <div className="flex justify-between items-start pt-1.5 sm:pt-2 h-full">
            {/* Bottom Left Panel: Name, Mission Code */}
            <div className="w-[55%] h-full flex items-start">
              <div className="w-1 sm:w-1.5 h-[70%] bg-purple-500/50 rounded-sm mr-1 sm:mr-1.5 mt-0.5 pattern-vertical-lines pattern-purple-700/70 pattern-bg-transparent pattern-size-1"></div>
              <div className="text-white leading-tight">
                <p className="text-[5px] sm:text-[6px] text-slate-400 uppercase">Name</p>
                <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-tight" style={{fontFamily: "'Orbitron', sans-serif"}}>TYRA:</p>
                <p className="text-[5px] sm:text-[6px] text-slate-400 uppercase mt-1">Mission Code</p>
                <p className="text-[6px] sm:text-[7px] font-medium text-purple-300 uppercase tracking-tighter" style={{fontFamily: "'Orbitron', sans-serif"}}>#AWAKENEMOTIONS</p>
              </div>
            </div>

            {/* Bottom Right Panel: Logo, Brand Name */}
            <div className="w-[40%] h-full flex flex-col items-center justify-center text-center relative">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                    <StarIcon className="w-full h-full text-purple-300/80 filter drop-shadow-[0_0_3px_theme(colors.purple.300)]"/>
                    {/* Concentric circles for logo */}
                    <div className="absolute inset-[15%] border-2 border-purple-400/50 rounded-full"></div>
                    <div className="absolute inset-[30%] border border-purple-500/40 rounded-full"></div>
                </div>
              <p className="text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-normal mt-px" style={{fontFamily: "'Orbitron', sans-serif"}}>MAVE:</p>
            </div>
          </div>
        </div>
         {/* Copyright Information */}
        <p className="absolute bottom-[0.5%] left-0 right-0 text-center text-[3px] sm:text-[4px] text-slate-500/80 tracking-tightest">
            ©&℗ METAVERSE ENTERTAINMENT INC.
        </p>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');

        .clip-path-polygon-\\[0\\%_0\\%\\,\\_100\\%_0\\%\\,\\_100\\%_70\\%\\,\\_80\\%_100\\%\\,\\_0\\%_100\\%\\] {
          clip-path: polygon(0% 0%, 100% 0%, 100% 70%, 80% 100%, 0% 100%);
        }
        .writing-mode-vertical-rl {
          writing-mode: vertical-rl;
        }
        @keyframes shimmer {
          0% { background-position: -100% -100%; }
          100% { background-position: 100% 100%; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear alternate;
        }
        .pattern-crosshatch { /* Example for holo sticker */
            background-image:
                linear-gradient(45deg, rgba(200,200,255,0.1) 25%, transparent 25%, transparent 75%, rgba(200,200,255,0.1) 75%),
                linear-gradient(-45deg, rgba(200,200,255,0.1) 25%, transparent 25%, transparent 75%, rgba(200,200,255,0.1) 75%);
            background-size: var(--pattern-size, 4px) var(--pattern-size, 4px);
            background-color: var(--pattern-bg-transparent, transparent);
        }
         .pattern-vertical-lines {
            background-image: linear-gradient(to right,
                var(--pattern-color, rgba(168, 85, 247, 0.5)) 50%,
                var(--pattern-bg-color, transparent) 50%);
            background-size: var(--pattern-size, 2px) 100%;
        }
      `}</style>
    </div>
  );
};
