'use client';

import { useState, useRef } from 'react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  // Character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const generatePassword = () => {
    let chars = '';
    let newPassword = '';
    
    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;
    
    // If no character types are selected, include all
    if (chars === '') {
      chars = uppercaseChars + lowercaseChars + numberChars + symbolChars;
      setIncludeUppercase(true);
      setIncludeLowercase(true);
      setIncludeNumbers(true);
      setIncludeSymbols(true);
    }
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      newPassword += chars[randomIndex];
    }
    
    setPassword(newPassword);
    calculateStrength(newPassword);
    setCopied(false);
  };

  const calculateStrength = (pwd: string) => {
    let strengthValue = 0;
    
    // Length contributes up to 40% of strength
    strengthValue += Math.min(pwd.length / 20, 0.4);
    
    // Character variety contributes up to 60%
    let varietyScore = 0;
    if (/[A-Z]/.test(pwd)) varietyScore += 0.15;
    if (/[a-z]/.test(pwd)) varietyScore += 0.15;
    if (/[0-9]/.test(pwd)) varietyScore += 0.15;
    if (/[^A-Za-z0-9]/.test(pwd)) varietyScore += 0.15;
    
    strengthValue += varietyScore;
    setStrength(strengthValue);
  };

  const copyToClipboard = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    if (strength < 0.3) return 'bg-red-500';
    if (strength < 0.6) return 'bg-yellow-500';
    if (strength < 0.8) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 0.3) return 'Weak';
    if (strength < 0.6) return 'Medium';
    if (strength < 0.8) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Password Generator
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Create strong and secure passwords
          </p>
          
          {/* Password Display */}
          <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-200 relative">
            <div className="text-2xl font-mono text-gray-800 break-all pr-12">
              {password || 'Your password will appear here'}
            </div>
            
            {password && (
              <button
                onClick={copyToClipboard}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                )}
              </button>
            )}
          </div>
          
          {/* Strength Meter */}
          {password && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Password strength:</span>
                <span className={`text-sm font-semibold ${getStrengthColor().replace('bg-', 'text-')}`}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${strength * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Options */}
          <div className="space-y-6">
            {/* Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="length-slider" className="text-lg font-medium text-gray-700">
                  Password Length: <span className="text-blue-600">{length}</span>
                </label>
              </div>
              <input
                id="length-slider"
                type="range"
                min="4"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>32</span>
              </div>
            </div>
            
            {/* Character Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  id="uppercase-checkbox"
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="uppercase-checkbox" className="ml-2 text-lg font-medium text-gray-700">
                  Uppercase Letters
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="lowercase-checkbox"
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="lowercase-checkbox" className="ml-2 text-lg font-medium text-gray-700">
                  Lowercase Letters
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="numbers-checkbox"
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="numbers-checkbox" className="ml-2 text-lg font-medium text-gray-700">
                  Numbers
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="symbols-checkbox"
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={() => setIncludeSymbols(!includeSymbols)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="symbols-checkbox" className="ml-2 text-lg font-medium text-gray-700">
                  Symbols
                </label>
              </div>
            </div>
            
            {/* Generate Button */}
            <button
              onClick={generatePassword}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg text-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
            >
              Generate Password
            </button>
          </div>
          
          {/* Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Password Tips:</h3>
            <ul className="text-sm text-blue-600 list-disc pl-5 space-y-1">
              <li>Use at least 12 characters</li>
              <li>Include uppercase, lowercase, numbers, and symbols</li>
              <li>Avoid common words or personal information</li>
              <li>Use a unique password for each account</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}