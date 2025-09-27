"use client";
import { useState, useEffect, useRef } from "react";

export default function TimerPage() {
  const [time, setTime] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsActive(false);
            
            // Play completion sound when timer reaches 0
            if (!hasPlayedSound) {
              playCompletionSound();
              setHasPlayedSound(true);
            }
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
  }, [isActive, isPaused, hasPlayedSound]);

  const playCompletionSound = () => {
    try {
      // Initialize AudioContext if not already done
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Create a positive completion melody (ascending scale)
      const now = context.currentTime;
      const duration = 4; // 4 seconds total
      
      oscillator.type = "sine";
      
      // Positive ascending scale notes (C major scale)
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50]; // C5 to C6
      const noteDuration = 0.3;
      const pauseDuration = 0.1;
      
      gainNode.gain.setValueAtTime(0, now);
      
      let currentTime = now;
      
      // Play ascending scale
      for (let i = 0; i < notes.length; i++) {
        oscillator.frequency.setValueAtTime(notes[i], currentTime);
        
        // Fade in
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.05);
        
        // Fade out
        gainNode.gain.setValueAtTime(0.3, currentTime + noteDuration - 0.05);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + noteDuration);
        
        currentTime += noteDuration + pauseDuration;
      }
      
      // Final celebratory chord
      setTimeout(() => {
        try {
          const chordOscillator1 = context.createOscillator();
          const chordOscillator2 = context.createOscillator();
          const chordGain = context.createGain();
          
          chordOscillator1.connect(chordGain);
          chordOscillator2.connect(chordGain);
          chordGain.connect(context.destination);
          
          chordOscillator1.type = "sine";
          chordOscillator2.type = "sine";
          chordOscillator1.frequency.setValueAtTime(659.25, 0); // E5
          chordOscillator2.frequency.setValueAtTime(523.25, 0); // C5
          
          chordGain.gain.setValueAtTime(0, 0);
          chordGain.gain.linearRampToValueAtTime(0.1, 0.1);
          chordGain.gain.exponentialRampToValueAtTime(0.001, 1.5);
          
          chordOscillator1.start();
          chordOscillator2.start();
          chordOscillator1.stop(1.5);
          chordOscillator2.stop(1.5);
        } catch (e) {
          console.log("Chord playback failed:", e);
        }
      }, (notes.length * (noteDuration + pauseDuration)) * 1000);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
      
    } catch (error) {
      console.log("Sound playback failed:", error);
      // Fallback to using external sound
      fallbackSound();
    }
  };

  const fallbackSound = () => {
    // Stop any existing fallback sound
    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.pause();
      fallbackAudioRef.current.currentTime = 0;
    }
    
    // Positive completion sound - gentle wind chime/positive notification
    fallbackAudioRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3");
    fallbackAudioRef.current.volume = 3.5;
    
    const playAlarm = () => {
      if (fallbackAudioRef.current) {
        fallbackAudioRef.current.currentTime = 0;
        fallbackAudioRef.current.play().catch(e => console.log("Fallback sound play failed:", e));
      }
    };
    
    // Play once (no looping needed for this positive sound)
    playAlarm();
  };

  // Test sound function
  const testSound = () => {
    playCompletionSound();
  };

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
    setHasPlayedSound(false);
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
    setHasPlayedSound(false);
    
    // Stop any currently playing sound
    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.pause();
      fallbackAudioRef.current.currentTime = 0;
    }
  };

  const handleTimeChange = (minutes: number) => {
    setSelectedMinutes(minutes);
    if (!isActive) {
      setTime(minutes * 60);
      setHasPlayedSound(false);
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
              Focus Timer
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
            
            {/* Completion indicator */}
            {time === 0 && isActive === false && (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <div className="text-2xl font-bold">Great Job! Completed!</div>
                  <div className="text-lg mt-2 opacity-90">Celebrating your achievement...</div>
                </div>
              </div>
            )}
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
                  🚀 Start Focus Session
                </button>
              ) : isPaused ? (
                <>
                  <button
                    onClick={handleResume}
                    className="col-span-2 px-4 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg shadow-emerald-200"
                  >
                    ▶️ Continue Focus
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-4 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl text-lg font-semibold hover:from-indigo-200 hover:to-indigo-300 transition-all transform hover:scale-105 shadow-md"
                  >
                    🔄 New Session
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePause}
                    className="col-span-2 px-4 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-amber-200"
                  >
                    ⏸️ Pause Focus
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-4 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl text-lg font-semibold hover:from-indigo-200 hover:to-indigo-300 transition-all transform hover:scale-105 shadow-md"
                  >
                    🔄 End Session
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Custom Time Input */}
          <div className="bg-indigo-50 p-5 rounded-2xl shadow-inner">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">Custom Time</h3>
            <label className="block text-indigo-700 mb-4">
              Set focus time (1-180 minutes):
            </label>
            <div className="flex items-center gap-5">
              <input
                type="range"
                min="1"
                max="180"
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

          {/* Sound Test Button */}
          <div className="flex justify-center mt-2">
            <button
              onClick={testSound}
              className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:from-green-200 hover:to-emerald-200 transition-colors border border-emerald-200"
            >
              🎵 Test  Sound
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
