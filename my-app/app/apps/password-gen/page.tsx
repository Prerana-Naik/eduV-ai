// app/apps/password-gen/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog } from '@headlessui/react';
import { X, Copy, Save, Trash2, Eye, EyeOff, Lock, Shield, Zap, History } from 'lucide-react';

interface PasswordEntry {
  id: string;
  title: string;
  generated_password: string;
  strength: string;
  length: number;
  created_at: string;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // New states for storage functionality
  const [title, setTitle] = useState('');
  const [savedPasswords, setSavedPasswords] = useState<PasswordEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  // Character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Load current user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
        return;
      }
      setUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  // Load saved passwords
  useEffect(() => {
    if (userId) {
      loadSavedPasswords();
    }
  }, [userId]);

  const loadSavedPasswords = async () => {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPasswords(data || []);
    } catch (error) {
      console.error('Error loading passwords:', error);
    }
  };

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
    setShowPassword(false);
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

  const savePassword = async () => {
    if (!password || !userId) return;

    const strengthText = getStrengthText();
    const passwordTitle = title || `Password ${new Date().toLocaleDateString()}`;

    try {
      const { data, error } = await supabase
        .from('passwords')
        .insert([
          {
            user_id: userId,
            title: passwordTitle,
            generated_password: password,
            strength: strengthText,
            length: length
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setSavedPasswords([data, ...savedPasswords]);
      setTitle('');
      alert('Password saved successfully!');
    } catch (error) {
      console.error('Error saving password:', error);
      alert('Error saving password');
    }
  };

  const deletePassword = async (passwordId: string) => {
    try {
      const { error } = await supabase
        .from('passwords')
        .delete()
        .eq('id', passwordId)
        .eq('user_id', userId);

      if (error) throw error;
      setSavedPasswords(savedPasswords.filter(p => p.id !== passwordId));
      if (selectedPassword?.id === passwordId) setSelectedPassword(null);
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const loadPassword = (passwordEntry: PasswordEntry) => {
    setPassword(passwordEntry.generated_password);
    setLength(passwordEntry.length);
    calculateStrength(passwordEntry.generated_password);
    setSelectedPassword(passwordEntry);
    setShowSaved(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Generator Panel */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Password Generator
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Create strong and secure passwords
          </p>
          
          {/* Password Display */}
          <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-200 relative">
            <div className="text-xs font-mono text-gray-800 break-all pr-16">
              {password ? (showPassword ? password : '•'.repeat(password.length)) : 'Your password will appear here'}
            </div>
            
            {password && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-gray-600" />}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <Copy className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Save Password Input */}
          {password && userId && (
            <div className="mb-6">
              <label htmlFor="password-title" className="block text-sm font-medium text-gray-700 mb-2">
                Save this password (optional):
              </label>
              <div className="flex gap-2">
                <input
                  id="password-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title (e.g., 'Gmail account')"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={savePassword}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  title="Save password"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          )}
          
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
          
          {/* View Saved Passwords Button */}
          {userId && (
            <button
              onClick={() => setShowSaved(true)}
              className="w-full mt-4 bg-gray-600 text-white py-3 px-4 rounded-lg text-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <History className="w-5 h-5" />
              View Saved Passwords ({savedPasswords.length})
            </button>
          )}
        </div>

        {/* Saved Passwords Panel */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-b from-gray-50 to-purple-50 border-t md:border-t-0 md:border-l border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
            <Lock className="w-6 h-6" />
            Saved Passwords
          </h2>
          
          {!userId ? (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sign in to save and manage your passwords</p>
            </div>
          ) : savedPasswords.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No saved passwords yet</p>
              <p className="text-gray-500 text-sm mt-2">Generate and save passwords to see them here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {savedPasswords.map((passwordEntry) => (
                <div
                  key={passwordEntry.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => loadPassword(passwordEntry)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {passwordEntry.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePassword(passwordEntry.id);
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                      title="Delete password"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="font-mono">
                      {'•'.repeat(Math.min(passwordEntry.length, 12))}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        passwordEntry.strength === 'Very Strong' ? 'bg-green-100 text-green-800' :
                        passwordEntry.strength === 'Strong' ? 'bg-blue-100 text-blue-800' :
                        passwordEntry.strength === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {passwordEntry.strength}
                      </span>
                      <span>{formatDate(passwordEntry.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Password Detail Modal */}
      <Dialog open={!!selectedPassword} onClose={() => setSelectedPassword(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-xl font-semibold text-gray-800">
                Password Details
              </Dialog.Title>
              <button
                onClick={() => setSelectedPassword(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {selectedPassword && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900 font-medium">{selectedPassword.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-mono flex-1">
                      {showPassword ? selectedPassword.generated_password : '•'.repeat(selectedPassword.length)}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedPassword.generated_password);
                        alert('Password copied to clipboard!');
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPassword.strength === 'Very Strong' ? 'bg-green-100 text-green-800' :
                      selectedPassword.strength === 'Strong' ? 'bg-blue-100 text-blue-800' :
                      selectedPassword.strength === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedPassword.strength}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                    <p className="text-gray-900">{selectedPassword.length} characters</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-gray-900">{formatDate(selectedPassword.created_at)}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedPassword(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
