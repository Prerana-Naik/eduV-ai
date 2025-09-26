'use client';

import { useState, useRef } from 'react';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    // Use dynamic import to avoid TypeScript errors
    import('qrcode').then((QRCode) => {
      try {
        // Generate QR code as data URL
        QRCode.toDataURL(text, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }).then((url: string) => {
          setQrCode(url);
        });
        
        // Also render to canvas for download capability
        if (canvasRef.current) {
          QRCode.toCanvas(canvasRef.current, text, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
      } finally {
        setIsGenerating(false);
      }
    }).catch((err) => {
      console.error('Failed to load QRCode library:', err);
      setIsGenerating(false);
    });
  };

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `qrcode-${text.substring(0, 15)}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Input Section - Takes full width on mobile, 40% on desktop */}
        <div className="w-full md:w-2/5 p-8 bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Create custom QR codes for URLs, text, or contact information
          </p>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="text-input" className="block text-lg font-medium text-gray-700 mb-2">
                Enter text or URL
              </label>
              <input
                id="text-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com or any text"
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            
            <button
              onClick={generateQRCode}
              disabled={isGenerating || !text.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : 'Generate QR Code'}
            </button>
          </div>
        </div>
        
        {/* Output Section - Takes full width on mobile, 60% on desktop */}
        <div className="w-full md:w-3/5 p-8 flex flex-col items-center justify-center">
          {qrCode ? (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Your QR Code
              </h2>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                <img 
                  src={qrCode} 
                  alt="Generated QR Code" 
                  className="w-64 h-64"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg text-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow-md flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download
                </button>
                
                <button
                  onClick={() => {
                    setText('');
                    setQrCode('');
                  }}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg text-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors shadow-md"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v4m0 4h4m-6 4h6m4 0v-4m-4 4v4m-8-8v4m0 4h4m-6 4h6"></path>
                </svg>
              </div>
              <p className="text-xl text-gray-600">Your QR code will appear here</p>
              <p className="text-gray-500 mt-2">Enter text above and click "Generate QR Code"</p>
            </div>
          )}
          
          {/* Hidden canvas for download functionality */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}