"use client";
import { useState } from "react";

export default function MagicalCalculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const currentValue = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        if (b === 0) return 0;
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    const currentValue = parseFloat(display);
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue / 100));
  };

  const handlePlusMinus = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(-currentValue));
  };

  const handleButtonClick = (value: string) => {
    switch (value) {
      case "0": case "1": case "2": case "3": case "4":
      case "5": case "6": case "7": case "8": case "9":
        inputDigit(value);
        break;
      case ".":
        inputDecimal();
        break;
      case "C":
        clearAll();
        break;
      case "=":
        handleEquals();
        break;
      case "%":
        handlePercentage();
        break;
      case "±":
        handlePlusMinus();
        break;
      case "+": case "-": case "×": case "÷":
        performOperation(value);
        break;
    }
  };

  const getButtonStyle = (btn: string): string => {
    const baseStyle = "aspect-square rounded-xl text-2xl font-bold transition-all duration-300 transform active:scale-95 border-2 shadow-lg backdrop-blur-sm";

    if (["÷", "×", "-", "+", "="].includes(btn)) {
      return `${baseStyle} bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 border-purple-400 text-white hover:from-purple-500 hover:via-violet-500 hover:to-indigo-600 hover:shadow-2xl hover:shadow-purple-500 hover:border-purple-300`;
    } 
    else if (btn === "C") {
      return `${baseStyle} bg-gradient-to-br from-rose-600 to-pink-700 border-rose-400 text-white hover:from-rose-500 hover:to-pink-600 hover:shadow-2xl hover:shadow-rose-500 hover:border-rose-300`;
    }
    else if (["%", "±"].includes(btn)) {
      return `${baseStyle} bg-gradient-to-br from-indigo-800 to-purple-900 border-indigo-600 text-purple-200 hover:from-indigo-700 hover:to-purple-800 hover:shadow-xl hover:shadow-indigo-500 hover:border-indigo-400`;
    }
    else {
      return `${baseStyle} bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 text-purple-100 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:shadow-purple-500 hover:border-purple-500 hover:text-white`;
    }
  };

  const buttonRows = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="]
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-24 h-24 bg-indigo-500/25 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 bg-black/40 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-purple-500/30 w-full max-w-sm"
           style={{
             boxShadow: "0 0 60px rgba(147, 51, 234, 0.4), 0 0 100px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
           }}>
        
        {/* Header with magical title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2 animate-pulse">
            Basic Calculator
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Magical Display */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/90 border-2 border-purple-500/30 shadow-2xl relative overflow-hidden"
             style={{
               boxShadow: "inset 0 0 20px rgba(168, 85, 247, 0.3), 0 0 30px rgba(147, 51, 234, 0.2)"
             }}>
          {/* Display background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
          
          <div className="text-purple-200/80 text-sm font-mono mb-1 h-6 truncate relative z-10">
            {previousValue} {operation}
          </div>
          <div className="text-5xl font-light text-white font-mono truncate text-right relative z-10"
               style={{
                 textShadow: "0 0 10px rgba(192, 132, 252, 0.5), 0 0 20px rgba(192, 132, 252, 0.3)"
               }}>
            {display}
          </div>
        </div>

        {/* Magical Buttons Grid */}
        <div className="grid grid-cols-4 gap-4">
          {buttonRows.flat().map((btn, index) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`
                ${getButtonStyle(btn)}
                ${btn === "0" ? "col-span-2 aspect-auto" : ""}
                ${btn === "=" ? "bg-gradient-to-br from-purple-500 to-pink-600 border-purple-300" : ""}
                relative overflow-hidden
              `}
              style={{
                boxShadow: "0 0 20px rgba(192, 132, 252, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              }}
            >
              <span className="drop-shadow-lg">{btn}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-purple-300/60 text-sm font-light">
            Powered by Eduverse-AI 
          </div>
        </div>
      </div>

      {/* Add CSS for float animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }
      `}</style>
    </div>
  );
}
