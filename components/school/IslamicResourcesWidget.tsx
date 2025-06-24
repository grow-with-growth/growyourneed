import React, { useState, useEffect } from 'react';
import { ClockIcon, StarIcon } from '../icons';

interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
}

interface IslamicResourcesWidgetProps {
  compact?: boolean;
}

export const IslamicResourcesWidget: React.FC<IslamicResourcesWidgetProps> = ({ compact = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState('prayers');

  // Mock prayer times (in a real app, this would come from an API)
  const prayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '05:30', arabic: 'الفجر' },
    { name: 'Dhuhr', time: '12:45', arabic: 'الظهر' },
    { name: 'Asr', time: '16:15', arabic: 'العصر' },
    { name: 'Maghrib', time: '18:30', arabic: 'المغرب' },
    { name: 'Isha', time: '20:00', arabic: 'العشاء' }
  ];

  const islamicDate = {
    hijri: '15 Rajab 1446',
    gregorian: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  const quranVerses = [
    {
      arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
      translation: 'And whoever fears Allah - He will make for him a way out.',
      reference: 'Quran 65:2'
    },
    {
      arabic: 'وَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ',
      translation: 'But Allah is the best guardian, and He is the most merciful of the merciful.',
      reference: 'Quran 12:64'
    }
  ];

  const hadithOfTheDay = {
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Actions are but by intention.',
    reference: 'Sahih al-Bukhari 1'
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNextPrayer = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (prayerMinutes > now) {
        return prayer;
      }
    }
    return prayerTimes[0]; // Next day's Fajr
  };

  const nextPrayer = getNextPrayer();

  if (compact) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-200">Islamic Resources</h3>
          <StarIcon className="w-5 h-5 text-emerald-400" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Next Prayer:</span>
            <div className="text-right">
              <div className="text-slate-200 font-medium">{nextPrayer.name}</div>
              <div className="text-emerald-400 text-sm">{nextPrayer.time}</div>
            </div>
          </div>
          
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-slate-300 text-sm">{islamicDate.hijri}</div>
            <div className="text-slate-500 text-xs">{islamicDate.gregorian}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Islamic Resource Center</h2>
          <p className="text-slate-400 text-sm">Prayer times, Quran, and Islamic resources</p>
        </div>
        <div className="text-right">
          <div className="text-slate-300">{islamicDate.hijri}</div>
          <div className="text-slate-500 text-sm">{islamicDate.gregorian}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-700/30 rounded-lg p-1">
        {[
          { id: 'prayers', label: 'Prayer Times' },
          { id: 'quran', label: 'Quran' },
          { id: 'hadith', label: 'Hadith' },
          { id: 'calendar', label: 'Calendar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'prayers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Time */}
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <ClockIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-200">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <div className="text-slate-400 text-sm">Current Time</div>
            </div>

            {/* Next Prayer */}
            <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <StarIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-emerald-400">{nextPrayer.name}</div>
              <div className="text-slate-300">{nextPrayer.arabic}</div>
              <div className="text-emerald-400 font-medium">{nextPrayer.time}</div>
            </div>
          </div>

          {/* Prayer Times List */}
          <div className="space-y-2">
            {prayerTimes.map((prayer, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  prayer.name === nextPrayer.name 
                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                    : 'bg-slate-700/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    prayer.name === nextPrayer.name ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}></div>
                  <div>
                    <div className="text-slate-200 font-medium">{prayer.name}</div>
                    <div className="text-slate-400 text-sm">{prayer.arabic}</div>
                  </div>
                </div>
                <div className={`font-medium ${
                  prayer.name === nextPrayer.name ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {prayer.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'quran' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">Verse of the Day</h3>
          {quranVerses.map((verse, index) => (
            <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
              <div className="text-right mb-3">
                <div className="text-xl text-slate-200 font-arabic leading-relaxed">
                  {verse.arabic}
                </div>
              </div>
              <div className="text-slate-300 italic mb-2">"{verse.translation}"</div>
              <div className="text-slate-500 text-sm">— {verse.reference}</div>
            </div>
          ))}
          
          <button className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            Read Full Quran
          </button>
        </div>
      )}

      {selectedTab === 'hadith' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">Hadith of the Day</h3>
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <div className="text-right mb-3">
              <div className="text-xl text-slate-200 font-arabic leading-relaxed">
                {hadithOfTheDay.arabic}
              </div>
            </div>
            <div className="text-slate-300 italic mb-2">"{hadithOfTheDay.translation}"</div>
            <div className="text-slate-500 text-sm">— {hadithOfTheDay.reference}</div>
          </div>
          
          <button className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            Browse Hadith Collection
          </button>
        </div>
      )}

      {selectedTab === 'calendar' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">Islamic Calendar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-medium text-slate-200 mb-2">Current Month</h4>
              <div className="text-2xl font-bold text-emerald-400">Rajab</div>
              <div className="text-slate-400">رجب</div>
              <div className="text-slate-500 text-sm">1446 AH</div>
            </div>
            
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-medium text-slate-200 mb-2">Upcoming Events</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="text-slate-300">Isra and Mi'raj</div>
                  <div className="text-slate-500">27 Rajab</div>
                </div>
                <div className="text-sm">
                  <div className="text-slate-300">Ramadan</div>
                  <div className="text-slate-500">1 Ramadan</div>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            View Full Calendar
          </button>
        </div>
      )}
    </div>
  );
};
