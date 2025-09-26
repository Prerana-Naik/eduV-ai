'use client';

import { useState, useEffect } from 'react';

// Define conversion types and units
type ConversionCategory = {
  id: string;
  name: string;
  units: {
    id: string;
    name: string;
    abbreviation: string;
    conversionFactor: number; // Conversion factor to base unit
  }[];
};

const conversionCategories: ConversionCategory[] = [
  {
    id: 'length',
    name: 'Length',
    units: [
      { id: 'meters', name: 'Meters', abbreviation: 'm', conversionFactor: 1 },
      { id: 'kilometers', name: 'Kilometers', abbreviation: 'km', conversionFactor: 1000 },
      { id: 'centimeters', name: 'Centimeters', abbreviation: 'cm', conversionFactor: 0.01 },
      { id: 'millimeters', name: 'Millimeters', abbreviation: 'mm', conversionFactor: 0.001 },
      { id: 'miles', name: 'Miles', abbreviation: 'mi', conversionFactor: 1609.34 },
      { id: 'yards', name: 'Yards', abbreviation: 'yd', conversionFactor: 0.9144 },
      { id: 'feet', name: 'Feet', abbreviation: 'ft', conversionFactor: 0.3048 },
      { id: 'inches', name: 'Inches', abbreviation: 'in', conversionFactor: 0.0254 },
    ],
  },
  {
    id: 'weight',
    name: 'Weight',
    units: [
      { id: 'kilograms', name: 'Kilograms', abbreviation: 'kg', conversionFactor: 1 },
      { id: 'grams', name: 'Grams', abbreviation: 'g', conversionFactor: 0.001 },
      { id: 'milligrams', name: 'Milligrams', abbreviation: 'mg', conversionFactor: 0.000001 },
      { id: 'pounds', name: 'Pounds', abbreviation: 'lb', conversionFactor: 0.453592 },
      { id: 'ounces', name: 'Ounces', abbreviation: 'oz', conversionFactor: 0.0283495 },
      { id: 'tons', name: 'Tons', abbreviation: 't', conversionFactor: 1000 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    units: [
      { id: 'celsius', name: 'Celsius', abbreviation: '°C', conversionFactor: 1 },
      { id: 'fahrenheit', name: 'Fahrenheit', abbreviation: '°F', conversionFactor: 1 },
      { id: 'kelvin', name: 'Kelvin', abbreviation: 'K', conversionFactor: 1 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    units: [
      { id: 'squareMeters', name: 'Square Meters', abbreviation: 'm²', conversionFactor: 1 },
      { id: 'squareKilometers', name: 'Square Kilometers', abbreviation: 'km²', conversionFactor: 1000000 },
      { id: 'squareMiles', name: 'Square Miles', abbreviation: 'mi²', conversionFactor: 2590000 },
      { id: 'acres', name: 'Acres', abbreviation: 'ac', conversionFactor: 4046.86 },
      { id: 'hectares', name: 'Hectares', abbreviation: 'ha', conversionFactor: 10000 },
      { id: 'squareFeet', name: 'Square Feet', abbreviation: 'ft²', conversionFactor: 0.092903 },
      { id: 'squareInches', name: 'Square Inches', abbreviation: 'in²', conversionFactor: 0.00064516 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    units: [
      { id: 'liters', name: 'Liters', abbreviation: 'L', conversionFactor: 1 },
      { id: 'milliliters', name: 'Milliliters', abbreviation: 'mL', conversionFactor: 0.001 },
      { id: 'cubicMeters', name: 'Cubic Meters', abbreviation: 'm³', conversionFactor: 1000 },
      { id: 'gallons', name: 'Gallons', abbreviation: 'gal', conversionFactor: 3.78541 },
      { id: 'quarts', name: 'Quarts', abbreviation: 'qt', conversionFactor: 0.946353 },
      { id: 'pints', name: 'Pints', abbreviation: 'pt', conversionFactor: 0.473176 },
      { id: 'cups', name: 'Cups', abbreviation: 'cup', conversionFactor: 0.24 },
      { id: 'fluidOunces', name: 'Fluid Ounces', abbreviation: 'fl oz', conversionFactor: 0.0295735 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    units: [
      { id: 'seconds', name: 'Seconds', abbreviation: 's', conversionFactor: 1 },
      { id: 'minutes', name: 'Minutes', abbreviation: 'min', conversionFactor: 60 },
      { id: 'hours', name: 'Hours', abbreviation: 'hr', conversionFactor: 3600 },
      { id: 'days', name: 'Days', abbreviation: 'd', conversionFactor: 86400 },
      { id: 'weeks', name: 'Weeks', abbreviation: 'wk', conversionFactor: 604800 },
      { id: 'months', name: 'Months', abbreviation: 'mo', conversionFactor: 2628000 },
      { id: 'years', name: 'Years', abbreviation: 'yr', conversionFactor: 31536000 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    units: [
      { id: 'metersPerSecond', name: 'Meters/Second', abbreviation: 'm/s', conversionFactor: 1 },
      { id: 'kilometersPerHour', name: 'Kilometers/Hour', abbreviation: 'km/h', conversionFactor: 0.277778 },
      { id: 'milesPerHour', name: 'Miles/Hour', abbreviation: 'mph', conversionFactor: 0.44704 },
      { id: 'feetPerSecond', name: 'Feet/Second', abbreviation: 'ft/s', conversionFactor: 0.3048 },
      { id: 'knots', name: 'Knots', abbreviation: 'kn', conversionFactor: 0.514444 },
    ],
  },
];

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState(conversionCategories[0]);
  const [fromUnit, setFromUnit] = useState(conversionCategories[0].units[0]);
  const [toUnit, setToUnit] = useState(conversionCategories[0].units[1]);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const category = conversionCategories.find(c => c.id === categoryId);
    if (category) {
      setActiveCategory(category);
      setFromUnit(category.units[0]);
      setToUnit(category.units[1]);
      setFromValue('');
      setToValue('');
    }
  };

  // Handle conversion
  useEffect(() => {
    if (!fromValue) {
      setToValue('');
      return;
    }

    const inputValue = parseFloat(fromValue);
    if (isNaN(inputValue)) {
      setToValue('Invalid input');
      return;
    }

    let result: number;

    // Special handling for temperature conversions
    if (activeCategory.id === 'temperature') {
      if (fromUnit.id === 'celsius') {
        if (toUnit.id === 'fahrenheit') {
          result = (inputValue * 9/5) + 32;
        } else if (toUnit.id === 'kelvin') {
          result = inputValue + 273.15;
        } else {
          result = inputValue;
        }
      } else if (fromUnit.id === 'fahrenheit') {
        if (toUnit.id === 'celsius') {
          result = (inputValue - 32) * 5/9;
        } else if (toUnit.id === 'kelvin') {
          result = (inputValue - 32) * 5/9 + 273.15;
        } else {
          result = inputValue;
        }
      } else if (fromUnit.id === 'kelvin') {
        if (toUnit.id === 'celsius') {
          result = inputValue - 273.15;
        } else if (toUnit.id === 'fahrenheit') {
          result = (inputValue - 273.15) * 9/5 + 32;
        } else {
          result = inputValue;
        }
      } else {
        result = inputValue;
      }
    } else {
      // Standard conversion for other units
      const baseValue = inputValue * fromUnit.conversionFactor;
      result = baseValue / toUnit.conversionFactor;
    }

    // Format the result with appropriate precision
    const formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
    setToValue(formattedResult);
  }, [fromValue, fromUnit, toUnit, activeCategory]);

  // Swap units
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 mt-4">
          Unit Converter
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Convert between various units of measurement
        </p>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Conversion Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {conversionCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`p-3 rounded-lg text-center transition-all ${
                  activeCategory.id === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                <div className="font-medium text-sm">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Converter Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* From Unit */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">From</label>
              <select
                value={fromUnit.id}
                onChange={(e) => {
                  const unit = activeCategory.units.find(u => u.id === e.target.value);
                  if (unit) setFromUnit(unit);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {activeCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                placeholder="Enter value"
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapUnits}
                className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                aria-label="Swap units"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </button>
            </div>

            {/* To Unit */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">To</label>
              <select
                value={toUnit.id}
                onChange={(e) => {
                  const unit = activeCategory.units.find(u => u.id === e.target.value);
                  if (unit) setToUnit(unit);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {activeCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={toValue}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg text-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Conversion Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Common {activeCategory.name} Conversions
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {fromUnit.name}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {toUnit.name}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 5, 10, 25, 50, 100].map((value) => {
                  let result: number;
                  
                  if (activeCategory.id === 'temperature') {
                    if (fromUnit.id === 'celsius') {
                      if (toUnit.id === 'fahrenheit') {
                        result = (value * 9/5) + 32;
                      } else if (toUnit.id === 'kelvin') {
                        result = value + 273.15;
                      } else {
                        result = value;
                      }
                    } else if (fromUnit.id === 'fahrenheit') {
                      if (toUnit.id === 'celsius') {
                        result = (value - 32) * 5/9;
                      } else if (toUnit.id === 'kelvin') {
                        result = (value - 32) * 5/9 + 273.15;
                      } else {
                        result = value;
                      }
                    } else if (fromUnit.id === 'kelvin') {
                      if (toUnit.id === 'celsius') {
                        result = value - 273.15;
                      } else if (toUnit.id === 'fahrenheit') {
                        result = (value - 273.15) * 9/5 + 32;
                      } else {
                        result = value;
                      }
                    } else {
                      result = value;
                    }
                  } else {
                    const baseValue = value * fromUnit.conversionFactor;
                    result = baseValue / toUnit.conversionFactor;
                  }
                  
                  return (
                    <tr key={value}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {value} {fromUnit.abbreviation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.toFixed(6).replace(/\.?0+$/, '')} {toUnit.abbreviation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}