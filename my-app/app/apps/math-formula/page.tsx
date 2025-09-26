"use client";

import { useState, useEffect } from "react";

type Formula = {
  id: number;
  title: string;
  formula: string;
  description: string;
  category: string;
};

const formulas: Formula[] = [
  // Algebra
  { id: 1, title: "Quadratic Formula", formula: "x = (-b ± √(b² - 4ac)) / (2a)", description: "Solutions of ax² + bx + c = 0", category: "algebra" },
  { id: 2, title: "Binomial Theorem", formula: "(a+b)^n = Σ [nCk * a^(n-k) * b^k]", description: "Expansion of powers of binomials", category: "algebra" },
  { id: 3, title: "Sum of Arithmetic Series", formula: "Sₙ = n/2 (a₁ + aₙ)", description: "Sum of first n terms of AP", category: "algebra" },
  { id: 4, title: "Sum of Geometric Series", formula: "Sₙ = a(1-rⁿ)/(1-r)", description: "Sum of GP terms", category: "algebra" },
  { id: 5, title: "Distance Formula", formula: "d = √((x₂-x₁)² + (y₂-y₁)²)", description: "Distance between two points", category: "algebra" },
  { id: 6, title: "Midpoint Formula", formula: "M = ((x₁+x₂)/2, (y₁+y₂)/2)", description: "Midpoint of line segment", category: "algebra" },
  { id: 7, title: "Slope Formula", formula: "m = (y₂-y₁)/(x₂-x₁)", description: "Slope of a line", category: "algebra" },
  { id: 8, title: "Sum of Cubes", formula: "a³ + b³ = (a+b)(a² - ab + b²)", description: "Identity for cubes", category: "algebra" },
  { id: 9, title: "Difference of Cubes", formula: "a³ - b³ = (a-b)(a² + ab + b²)", description: "Identity for difference of cubes", category: "algebra" },
  { id: 10, title: "Logarithm Property", formula: "logₐ(xy) = logₐx + logₐy", description: "Product rule of logs", category: "algebra" },

  // Geometry
  { id: 11, title: "Pythagoras Theorem", formula: "a² + b² = c²", description: "Right triangle relation", category: "geometry" },
  { id: 12, title: "Area of Triangle", formula: "A = ½ * b * h", description: "Basic triangle area", category: "geometry" },
  { id: 13, title: "Area using Heron’s Formula", formula: "A = √(s(s-a)(s-b)(s-c))", description: "Area using sides", category: "geometry" },
  { id: 14, title: "Circumference of Circle", formula: "C = 2πr", description: "Perimeter of circle", category: "geometry" },
  { id: 15, title: "Area of Circle", formula: "A = πr²", description: "Circle area", category: "geometry" },
  { id: 16, title: "Surface Area of Sphere", formula: "A = 4πr²", description: "Sphere surface area", category: "geometry" },
  { id: 17, title: "Volume of Sphere", formula: "V = 4/3 πr³", description: "Sphere volume", category: "geometry" },
  { id: 18, title: "Volume of Cone", formula: "V = ⅓πr²h", description: "Cone volume", category: "geometry" },
  { id: 19, title: "Volume of Cylinder", formula: "V = πr²h", description: "Cylinder volume", category: "geometry" },
  { id: 20, title: "Diagonal of Rectangle", formula: "d = √(l² + w²)", description: "Diagonal of rectangle", category: "geometry" },

  // Trigonometry
  { id: 21, title: "Sine Rule", formula: "a/sin(A) = b/sin(B) = c/sin(C)", description: "Relation in triangle", category: "trigonometry" },
  { id: 22, title: "Cosine Rule", formula: "c² = a² + b² - 2ab cos(C)", description: "Relation in triangle", category: "trigonometry" },
  { id: 23, title: "Tangent Identity", formula: "tan(θ) = sin(θ)/cos(θ)", description: "Definition of tan", category: "trigonometry" },
  { id: 24, title: "Pythagorean Identity", formula: "sin²θ + cos²θ = 1", description: "Trigonometric identity", category: "trigonometry" },
  { id: 25, title: "Double Angle Formula", formula: "sin(2θ) = 2sinθcosθ", description: "Double angle sine", category: "trigonometry" },
  { id: 26, title: "Cos Double Angle", formula: "cos(2θ) = cos²θ - sin²θ", description: "Double angle cosine", category: "trigonometry" },
  { id: 27, title: "Tan Double Angle", formula: "tan(2θ) = 2tanθ/(1-tan²θ)", description: "Double angle tangent", category: "trigonometry" },
  { id: 28, title: "Law of Cot", formula: "cot²θ + 1 = csc²θ", description: "Trigonometric identity", category: "trigonometry" },
  { id: 29, title: "Law of Sec", formula: "tan²θ + 1 = sec²θ", description: "Trigonometric identity", category: "trigonometry" },
  { id: 30, title: "Sum-to-Product", formula: "sinA + sinB = 2sin((A+B)/2)cos((A-B)/2)", description: "Sum to product identity", category: "trigonometry" },

  // Calculus
  { id: 31, title: "Derivative of Power", formula: "d/dx(xⁿ) = n·xⁿ⁻¹", description: "Basic differentiation rule", category: "calculus" },
  { id: 32, title: "Derivative of sin", formula: "d/dx(sin x) = cos x", description: "Derivative of sine", category: "calculus" },
  { id: 33, title: "Derivative of cos", formula: "d/dx(cos x) = -sin x", description: "Derivative of cosine", category: "calculus" },
  { id: 34, title: "Derivative of e^x", formula: "d/dx(e^x) = e^x", description: "Exponential derivative", category: "calculus" },
  { id: 35, title: "Derivative of ln(x)", formula: "d/dx(ln x) = 1/x", description: "Logarithmic derivative", category: "calculus" },
  { id: 36, title: "Integration Power Rule", formula: "∫xⁿ dx = (xⁿ⁺¹)/(n+1) + C", description: "Basic integration rule", category: "calculus" },
  { id: 37, title: "Integration of sin", formula: "∫sin x dx = -cos x + C", description: "Integral of sine", category: "calculus" },
  { id: 38, title: "Integration of cos", formula: "∫cos x dx = sin x + C", description: "Integral of cosine", category: "calculus" },
  { id: 39, title: "Integration of e^x", formula: "∫e^x dx = e^x + C", description: "Integral of exponential", category: "calculus" },
  { id: 40, title: "Fundamental Theorem", formula: "∫[a→b] f'(x) dx = f(b) - f(a)", description: "Fundamental theorem of calculus", category: "calculus" },

  // Statistics
  { id: 41, title: "Mean", formula: "μ = Σxᵢ / N", description: "Average value", category: "statistics" },
  { id: 42, title: "Variance", formula: "σ² = Σ(xᵢ - μ)² / N", description: "Measure of spread", category: "statistics" },
  { id: 43, title: "Standard Deviation", formula: "σ = √(Σ(xᵢ - μ)² / N)", description: "Spread of data", category: "statistics" },
  { id: 44, title: "Z-Score", formula: "z = (x - μ)/σ", description: "Standard score", category: "statistics" },
  { id: 45, title: "Combination", formula: "nCr = n! / (r!(n-r)!)", description: "Number of combinations", category: "statistics" },
  { id: 46, title: "Permutation", formula: "nPr = n! / (n-r)!", description: "Number of arrangements", category: "statistics" },
  { id: 47, title: "Bayes Theorem", formula: "P(A|B) = P(B|A)P(A)/P(B)", description: "Conditional probability", category: "statistics" },
  { id: 48, title: "Expected Value", formula: "E(X) = Σ[xᵢ·P(xᵢ)]", description: "Mean of distribution", category: "statistics" },
  { id: 49, title: "Binomial Probability", formula: "P(X=k) = nCk p^k (1-p)^(n-k)", description: "Binomial distribution", category: "statistics" },
  { id: 50, title: "Normal Distribution", formula: "f(x) = 1/(σ√(2π)) e^(-(x-μ)²/(2σ²))", description: "Gaussian distribution", category: "statistics" },
];


export default function MathFormulasSPA() {
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState("all");

  const categories = ["all", "algebra", "geometry", "trigonometry", "calculus", "statistics"];

  const filtered = formulas.filter(f =>
    (category === "all" || f.category === category) &&
    (f.title.toLowerCase().includes(search.toLowerCase()) ||
     f.formula.toLowerCase().includes(search.toLowerCase()) ||
     f.description.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">📘 Math Formulas</h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600"
            />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white"
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
                category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Formula Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((f) => (
              <div key={f.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold">{f.title}</h2>
                  <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {f.category}
                  </span>
                </div>
                <div className="font-mono text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded mb-2">
                  {f.formula}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{f.description}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}
