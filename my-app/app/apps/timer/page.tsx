"use client";
import { useState, useEffect, useRef } from "react";

export default function TimerPage() {
  const [time, setTime] = useState(300); // 5 minutes default
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsActive(false);
            // Play completion sound (you could add this)
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (time === 0) {
      setTime(selectedMinutes * 60);
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setIsPaused(false);
    setTime(selectedMinutes * 60);
  };

  const handleTimeChange = (minutes: number) => {
    setSelectedMinutes(minutes);
    if (!isActive) {
      setTime(minutes * 60);
    }
  };

  const progress = time > 0 ? 100 - (time / (selectedMinutes * 60)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col items-center justify-center" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
      <div className="max-w-[95vw] w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-indigo-200/30 p-8 flex flex-row gap-8">
        {/* Left: Timer display */}
        <div className="flex flex-col flex-shrink-0 w-[45%]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-800 drop-shadow-md flex items-center gap-2">
              <span className="text-4xl">⏱️</span>
              Elegant Timer
            </h1>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${isActive ? (isPaused ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800') : 'bg-indigo-100 text-indigo-800'}`}>
              {isActive ? (isPaused ? '⏸️ Paused' : '▶️ Running') : '⏹️ Ready'}
            </div>
          </div>
          
          {/* Timer Display with gradient background */}
          <div className="flex-grow bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-lg border border-indigo-300/30 flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-white rounded-full"></div>
            </div>
            
            <div className="text-7xl font-mono font-bold text-white text-center relative z-10">
              {formatTime(time)}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-indigo-700 mb-1">
              <span>0%</span>
              <span className="font-medium">{Math.round(progress)}% complete</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right: Controls and settings */}
        <div className="flex flex-col w-[55%] gap-6">
          {/* Quick Select Buttons */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">Quick Select</h3>
            <div className="grid grid-cols-5 gap-3">
              {[1, 5, 10, 30, 60].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleTimeChange(minutes)}
                  className={`px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    selectedMinutes === minutes
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-md'
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">Controls</h3>
            <div className="grid grid-cols-3 gap-4">
              {!isActive && !isPaused ? (
                <button
                  onClick={handleStart}
                  className="col-span-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg shadow-emerald-200"
                >
                  🚀 Start Timer
                </button>
              ) : isPaused ? (
                <>
                  <button
                    onClick={handleResume}
                    className="col-span-2 px-4 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg shadow-emerald-200"
                  >
                    ▶️ Resume
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-4 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl text-lg font-semibold hover:from-indigo-200 hover:to-indigo-300 transition-all transform hover:scale-105 shadow-md"
                  >
                    🔄 Reset
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePause}
                    className="col-span-2 px-4 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-amber-200"
                  >
                    ⏸️ Pause
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-4 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl text-lg font-semibold hover:from-indigo-200 hover:to-indigo-300 transition-all transform hover:scale-105 shadow-md"
                  >
                    🔄 Reset
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Custom Time Input */}
          <div className="bg-indigo-50 p-5 rounded-2xl shadow-inner">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">Custom Time</h3>
            <label className="block text-indigo-700 mb-4">
              Set time (1-120 minutes):
            </label>
            <div className="flex items-center gap-5">
              <input
                type="range"
                min="1"
                max="120"
                value={selectedMinutes}
                onChange={(e) => handleTimeChange(parseInt(e.target.value))}
                className="flex-grow h-3 bg-indigo-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-grab"
              />
              <span className="text-indigo-800 font-bold text-xl min-w-[70px] text-center bg-white py-2 px-4 rounded-xl shadow-sm">
                {selectedMinutes}m
              </span>
            </div>
          </div>

          {/* Time Details */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-5 rounded-2xl shadow-sm border border-indigo-200/50">
              <div className="font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                <span>⏳</span> Time Elapsed
              </div>
              <div className="text-2xl font-bold text-indigo-800">{formatTime(selectedMinutes * 60 - time)}</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-5 rounded-2xl shadow-sm border border-indigo-200/50">
              <div className="font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                <span>⌛</span> Time Remaining
              </div>
              <div className="text-2xl font-bold text-indigo-800">{formatTime(time)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}