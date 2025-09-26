"use client";
import { useState } from "react";

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [isScientificMode, setIsScientificMode] = useState(true);

  // Basic buttons with numbers arranged correctly (column-major order)
  const basicButtons = [
    "C", "⌫", "%", "÷",
    "7", "8", "9", "×",
    "4", "5", "6", "−",
    "1", "2", "3", "+",
    "0", ".", "(", ")",
    "=", "±"
  ];

  // Scientific buttons with numbers arranged in classic calculator order (column-major)
  const scientificButtons = [
    "C", "⌫", "%", "÷", "π",
    "7", "8", "9", "×", "x²",
    "4", "5", "6", "−", "x³",
    "1", "2", "3", "+", "√",
    "0", ".", "(", ")", "=",
    "sin", "cos", "tan", "log", "±"
  ];

  const clearDisplay = () => setDisplay("0");
  const backspace = () => {
    setDisplay((curr) => (curr.length > 1 ? curr.slice(0, -1) : "0"));
  };
  const appendToDisplay = (value: string) => {
    setDisplay((curr) => (curr === "0" && value !== "." ? value : curr + value));
  };
  const changeSign = () => {
    if (display !== "0") {
      if (display.startsWith("-")) {
        setDisplay(display.substring(1));
      } else {
        setDisplay("-" + display);
      }
    }
  };
  const handleScientificFunction = (func: string) => {
    if (func === "π") {
      appendToDisplay("3.1416");
    } else if (func === "x²") {
      setDisplay(display + "²");
      calculate();
    } else if (func === "x³") {
      setDisplay(display + "³");
      calculate();
    } else if (func === "√") {
      setDisplay(`√(${display})`);
      calculate();
    } else {
      setDisplay(`${func}(${display})`);
      calculate();
    }
  };
  const calculate = () => {
    try {
      let expression = display
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/π/g, Math.PI.toString())
        .replace(/²/g, "**2")
        .replace(/³/g, "**3")
        .replace(/√\(/g, "Math.sqrt(");
      
      expression = expression.replace(/sin\(/g, "Math.sin(");
      expression = expression.replace(/cos\(/g, "Math.cos(");
      expression = expression.replace(/tan\(/g, "Math.tan(");
      expression = expression.replace(/log\(/g, "Math.log10(");
      
      const result = Function(`"use strict"; return (${expression})`)();
      setDisplay(String(Number.isInteger(result) ? result : result.toFixed(6)));
    } catch {
      setDisplay("Error");
      setTimeout(() => setDisplay("0"), 1500);
    }
  };
  const handleButtonClick = (button: string) => {
    if (button === "C") {
      clearDisplay();
    } else if (button === "⌫") {
      backspace();
    } else if (button === "=") {
      calculate();
    } else if (button === "±") {
      changeSign();
    } else if (["sin", "cos", "tan", "log", "√", "x²", "x³", "π"].includes(button)) {
      handleScientificFunction(button);
    } else {
      appendToDisplay(button);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 flex flex-col items-center justify-center" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
      <div className="max-w-[95vw] w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-orange-200/30 p-6 flex flex-row gap-6">
        {/* Left: Display and title with toggle */}
        <div className="flex flex-col flex-shrink-0 w-[35%]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-amber-800 drop-shadow-md">
              ✨ Warm Calculator
            </h1>
            <button
              onClick={() => setIsScientificMode(!isScientificMode)}
              className="px-4 py-2 bg-amber-600 text-white rounded-full text-sm hover:bg-amber-700 transition"
              aria-label="Toggle calculator mode"
            >
              {isScientificMode ? "Basic" : "Scientific"}
            </button>
          </div>
          <div className="flex-grow bg-amber-50 rounded-xl p-6 shadow-inner border border-amber-200 overflow-x-auto">
            <div className="text-right text-4xl font-mono text-amber-900 whitespace-nowrap" style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}>
              {display}
            </div>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className={`grid gap-3 ${isScientificMode ? "grid-cols-5" : "grid-cols-4"} w-[60%]`}>
          {(isScientificMode ? scientificButtons : basicButtons).map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`
                p-4 text-xl font-semibold rounded-xl transition active:scale-95 select-none
                ${btn === "=" 
                  ? "col-span-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  : ["+", "−", "×", "÷", "%"].includes(btn)
                    ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                    : ["C", "⌫"].includes(btn)
                      ? "bg-orange-200 text-orange-900 hover:bg-orange-300"
                      : ["sin", "cos", "tan", "log", "√", "x²", "x³", "π"].includes(btn)
                        ? "bg-amber-700 text-white hover:bg-amber-800"
                        : !isNaN(Number(btn)) || btn === "." || btn === "(" || btn === ")"
                          ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                          : "bg-amber-300 text-amber-900 hover:bg-amber-400"
                }
              `}
              style={btn === "=" ? { gridColumn: 'span 2' } : undefined}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}