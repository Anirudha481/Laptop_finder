import React, { useEffect, useState } from "react";
import "./App.css";

/* =========================================================
   API CONFIGURATION
========================================================= */
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://laptop-finder-api-jw07.onrender.com"
).replace(/\/+$/, "");

/* =========================================================
   PRESET QUICK-START CHIPS DATA
========================================================= */
const PRESET_CHIPS = [
  {
    label: "💻 B.Tech CS Student",
    config: {
      usage: "Coding",
      operatingSystem: "Windows",
      processorBrand: "Intel",
      processorSeries: "Core i5",
      ram: "16 GB",
      storage: "512 GB SSD",
      budget: "₹40,000 – ₹60,000",
    },
  },
  {
    label: "🎮 AAA Gaming (Under ₹80k)",
    config: {
      usage: "Gaming",
      operatingSystem: "Windows",
      gpuBrand: "NVIDIA",
      gpuSeries: "RTX 40 Series",
      ram: "16 GB",
      storage: "512 GB SSD",
      budget: "₹60,000 – ₹80,000",
    },
  },
  {
    label: "🍏 Developer MacBook",
    config: {
      usage: "Coding",
      operatingSystem: "macOS",
      processorBrand: "Apple",
      processorSeries: "Apple Silicon",
      ram: "16 GB",
      storage: "512 GB SSD",
      budget: "Above ₹1,00,000",
    },
  },
  {
    label: "🎬 4K Video Editing",
    config: {
      usage: "Editing",
      operatingSystem: "Windows",
      gpuBrand: "NVIDIA",
      ram: "32 GB",
      storage: "1 TB SSD",
      budget: "Above ₹1,00,000",
    },
  },
];

/* =========================================================
   OFFLINE FALLBACK CATALOGUE
========================================================= */
const fallbackLaptops = [
  {
    id: 1,
    brand: "HP",
    model: "15s Intel i3 12th Gen",
    price: 36990,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60",
    os: "Windows",
    processorBrand: "Intel",
    processor: "Core i3",
    generation: "12th Gen",
    gpuBrand: "Intel",
    gpuSeries: "Arc Series",
    gpu: "Intel Arc Graphics",
    ram: "8 GB",
    storage: "512 GB SSD",
    display: "15.6 inch",
    usage: ["Student", "Business"],
  },
  {
    id: 2,
    brand: "Lenovo",
    model: "IdeaPad Slim 3 i3 13th Gen",
    price: 39990,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60",
    os: "Windows",
    processorBrand: "Intel",
    processor: "Core i3",
    generation: "13th Gen",
    gpuBrand: "Intel",
    gpuSeries: "Arc Series",
    gpu: "Intel Arc Graphics",
    ram: "8 GB",
    storage: "256 GB SSD",
    display: "14 inch",
    usage: ["Student", "Business"],
  },
  {
    id: 5,
    brand: "ASUS",
    model: "Vivobook 15 i5 13th Gen",
    price: 54990,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60",
    os: "Windows",
    processorBrand: "Intel",
    processor: "Core i5",
    generation: "13th Gen",
    gpuBrand: "Intel",
    gpuSeries: "Arc Series",
    gpu: "Intel Arc Graphics",
    ram: "16 GB",
    storage: "512 GB SSD",
    display: "15.6 inch",
    usage: ["Student", "Coding", "Business"],
  },
  {
    id: 12,
    brand: "Lenovo",
    model: "LOQ 15 i7 13th Gen",
    price: 79990,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60",
    os: "Windows",
    processorBrand: "Intel",
    processor: "Core i7",
    generation: "13th Gen",
    gpuBrand: "NVIDIA",
    gpuSeries: "RTX 40 Series",
    gpu: "RTX 4060",
    ram: "16 GB",
    storage: "512 GB SSD",
    display: "15.6 inch",
    usage: ["Gaming", "Coding", "Editing"],
  },
  {
    id: 20,
    brand: "MSI",
    model: "Raider GE78 HX RTX 5090",
    price: 389990,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60",
    os: "Windows",
    processorBrand: "Intel",
    processor: "Core i7",
    generation: "13th Gen",
    gpuBrand: "NVIDIA",
    gpuSeries: "RTX 50 Series",
    gpu: "RTX 5090",
    ram: "32 GB",
    storage: "2 TB SSD",
    display: "17.3 inch",
    usage: ["Gaming", "Editing", "Design"],
  },
  {
    id: 30,
    brand: "ASUS",
    model: "TUF Gaming A16 Advantage",
    price: 89990,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60",
    os: "Windows",
    processorBrand: "AMD",
    processor: "Ryzen 7",
    generation: "7000 Series",
    gpuBrand: "AMD",
    gpuSeries: "RX 7000 Series",
    gpu: "RX 7600",
    ram: "16 GB",
    storage: "512 GB SSD",
    display: "16 inch",
    usage: ["Gaming", "Coding", "Editing"],
  },
  {
    id: 44,
    brand: "Apple",
    model: "MacBook Air M4",
    price: 99990,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60",
    os: "macOS",
    processorBrand: "Apple",
    processor: "Apple Silicon",
    generation: "M4",
    gpuBrand: "Apple",
    gpuSeries: "Apple GPU",
    gpu: "Apple GPU",
    ram: "16 GB",
    storage: "512 GB SSD",
    display: "13.3 inch",
    usage: ["Student", "Coding", "Business", "Editing"],
  },
];

/* =========================================================
   DROPDOWN SPECIFICATION TIERS
========================================================= */
const processorData = {
  Intel: {
    "Core i3": ["12th Gen", "13th Gen", "14th Gen"],
    "Core i5": ["12th Gen", "13th Gen", "14th Gen"],
    "Core i7": ["12th Gen", "13th Gen", "14th Gen"],
    "Core i9": ["12th Gen", "13th Gen", "14th Gen"],
    "Core Ultra 7": ["Ultra Series"],
    "Core Ultra 9": ["Ultra Series"],
  },
  AMD: {
    "Ryzen 5": ["5000 Series", "6000 Series", "7000 Series", "8000 Series"],
    "Ryzen 7": ["5000 Series", "6000 Series", "7000 Series", "8000 Series"],
    "Ryzen 9": ["5000 Series", "6000 Series", "7000 Series", "8000 Series", "9000 Series"],
  },
  Apple: {
    "Apple Silicon": ["M1", "M2", "M3", "M4", "M5"],
  },
};

const gpuData = {
  NVIDIA: {
    "RTX 50 Series": ["RTX 5090", "RTX 5080", "RTX 5070", "RTX 5060"],
    "RTX 40 Series": ["RTX 4090", "RTX 4080", "RTX 4070", "RTX 4060", "RTX 4050"],
    "RTX 30 Series": ["RTX 3090", "RTX 3080", "RTX 3070", "RTX 3060"],
  },
  AMD: {
    "RX 7000 Series": ["RX 7900", "RX 7800", "RX 7700", "RX 7600"],
    "RX 6000 Series": ["RX 6900", "RX 6800", "RX 6700", "RX 6600"],
  },
  Intel: {
    "Arc Series": ["Intel Arc Graphics"],
  },
  Apple: {
    "Apple GPU": ["Apple GPU"],
  },
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("laptopfinder-theme") === "dark";
  });

  const [laptops, setLaptops] = useState(fallbackLaptops);
  const [results, setResults] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiDriven, setIsAiDriven] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [form, setForm] = useState({
    usage: "",
    operatingSystem: "",
    processorBrand: "",
    processorSeries: "",
    processorGeneration: "",
    gpuBrand: "",
    gpuSeries: "",
    gpuModel: "",
    ram: "",
    storage: "",
    display: "",
    budget: "",
    maxBudget: 150000,
  });

  const [showResults, setShowResults] = useState(false);
  const [showingAlternatives, setShowingAlternatives] = useState(false);
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [isParsingPrompt, setIsParsingPrompt] = useState(false);

  // Helper: Amazon link
  const getBuyUrl = (laptop) => {
    if (!laptop) return "#";
    if (laptop.buyLink) return laptop.buyLink;
    const searchString = `${laptop.brand} ${laptop.model} ${laptop.processor}`;
    return `https://www.amazon.in/s?k=${encodeURIComponent(searchString)}`;
  };

  // Load state from URL Query Params on initialization
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialForm = { ...form };
    let hasParams = false;

    for (const [key, value] of params.entries()) {
      if (key in initialForm) {
        initialForm[key] = value;
        hasParams = true;
      }
    }

    if (hasParams) {
      setForm(initialForm);
    }
  }, []);

  // Fetch initial catalogue
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    fetch(`${API_BASE_URL}/api/laptops`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLaptops(data);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Backend API offline or waking up; using fallback catalogue.", err);
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Sync theme
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("laptopfinder-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Handle preset chip click
  const applyPreset = (presetConfig) => {
    setForm((prev) => ({
      ...prev,
      ...presetConfig,
    }));
  };

  // Share search URL feature
  const copyShareableLink = () => {
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePromptParse = async () => {
    if (!promptText.trim()) return;
    setIsParsingPrompt(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/parse-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText }),
      });

      const data = await response.json();
      if (data.success && data.filters) {
        setForm((prev) => ({
          ...prev,
          ...data.filters,
        }));
      }
    } catch (err) {
      console.error("Failed to parse prompt:", err);
    } finally {
      setIsParsingPrompt(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "operatingSystem") {
        updated.processorBrand = "";
        updated.processorSeries = "";
        updated.processorGeneration = "";
      }
      if (name === "processorBrand") {
        updated.processorSeries = "";
        updated.processorGeneration = "";
      }
      if (name === "processorSeries") {
        updated.processorGeneration = "";
      }
      if (name === "gpuBrand") {
        updated.gpuSeries = "";
        updated.gpuModel = "";
      }
      if (name === "gpuSeries") {
        updated.gpuModel = "";
      }

      return updated;
    });
  };

  let availableProcessorBrands = [];
  if (form.operatingSystem === "Windows") availableProcessorBrands = ["Intel", "AMD"];
  if (form.operatingSystem === "macOS") availableProcessorBrands = ["Apple"];

  const processorSeries = form.processorBrand
    ? Object.keys(processorData[form.processorBrand] || {})
    : [];

  const processorGenerations =
    form.processorBrand && form.processorSeries
      ? processorData[form.processorBrand]?.[form.processorSeries] || []
      : [];

  const gpuSeries = form.gpuBrand ? Object.keys(gpuData[form.gpuBrand] || {}) : [];
  const gpuModels =
    form.gpuBrand && form.gpuSeries ? gpuData[form.gpuBrand]?.[form.gpuSeries] || [] : [];

  const executeLocalFallbackSearch = () => {
    const budgetCap = Number(form.maxBudget) || 150000;
    const scored = laptops
      .filter((laptop) => laptop.price <= budgetCap)
      .map((laptop) => {
        let score = 0;
        let totalWeight = 0;

        const checkMatch = (selected, actual, weight) => {
          if (!selected) return;
          totalWeight += weight;
          if (selected.toLowerCase() === actual.toLowerCase()) score += weight;
        };

        checkMatch(form.operatingSystem, laptop.os, 3);
        checkMatch(form.processorBrand, laptop.processorBrand, 3);
        checkMatch(form.processorSeries, laptop.processor, 4);
        checkMatch(form.processorGeneration, laptop.generation, 3);
        checkMatch(form.gpuBrand, laptop.gpuBrand, 3);
        checkMatch(form.gpuSeries, laptop.gpuSeries, 4);
        checkMatch(form.gpuModel, laptop.gpu, 5);
        checkMatch(form.ram, laptop.ram, 2);
        checkMatch(form.storage, laptop.storage, 2);
        checkMatch(form.display, laptop.display, 2);

        if (form.usage) {
          totalWeight += 3;
          if (Array.isArray(laptop.usage) && laptop.usage.includes(form.usage)) score += 3;
        }

        const matchScore = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 85;

        return {
          ...laptop,
          matchScore: Math.min(matchScore, 100),
          aiVerdict: `Equipped with ${laptop.processor} and ${laptop.gpu}, providing reliable performance for ${
            form.usage || "demanding workloads"
          }.`,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    setIsAiDriven(false);
    setShowingAlternatives(true);
    setResults(scored);
    setShowResults(true);
  };

  const handleSearch = async () => {
    setIsAiLoading(true);
    setShowResults(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.laptops) && data.laptops.length > 0) {
        setIsAiDriven(true);
        setShowingAlternatives(false);
        setResults(data.laptops);
        setShowResults(true);
      } else {
        throw new Error("No laptops returned");
      }
    } catch (err) {
      console.warn("AI recommendation endpoint unreachable. Initiating local engine:", err);
      executeLocalFallbackSearch();
    } finally {
      clearTimeout(timeoutId);
      setIsAiLoading(false);
      setTimeout(() => {
        const resultsEl = document.querySelector(".results-section");
        if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const resetForm = () => {
    setForm({
      usage: "",
      operatingSystem: "",
      processorBrand: "",
      processorSeries: "",
      processorGeneration: "",
      gpuBrand: "",
      gpuSeries: "",
      gpuModel: "",
      ram: "",
      storage: "",
      display: "",
      budget: "",
      maxBudget: 150000,
    });
    setResults([]);
    setShowResults(false);
    setShowingAlternatives(false);
    setIsAiDriven(false);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const toggleCompare = (laptop) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === laptop.id);
      if (exists) return prev.filter((item) => item.id !== laptop.id);
      if (prev.length >= 3) {
        alert("You can compare up to 3 laptops side by side.");
        return prev;
      }
      return [...prev, laptop];
    });
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">💻 LaptopFinder AI</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#finder">Laptop Finder</a>
          <a href="#about">About</a>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-small">SMART LAPTOP DISCOVERY & PURCHASING</p>
            <h1>
              Find the Perfect Laptop
              <br />
              <span>Tailored by AI.</span>
            </h1>
            <p>
              Specify your preferred specifications, workload, and budget. Our AI evaluates bottlenecks, 
              ranks top machines, and provides instant store purchase links.
            </p>

            {/* PRESET QUICK CHIPS */}
            <div className="presets-container">
              <p className="presets-title">⚡ QUICK PRESET CHIPS:</p>
              <div className="chips-grid">
                {PRESET_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    className="preset-chip"
                    onClick={() => applyPreset(chip.config)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <a href="#finder" className="hero-button">
              Configure Specs →
            </a>
          </div>
          <div className="hero-laptop">⚡</div>
        </div>
      </section>

      {/* FINDER SECTION */}
      <section className="finder-section" id="finder">
        <div className="section-heading">
          <p>SPECIFICATION INPUTS</p>
          <h2>Tell Us What You Need</h2>
          <span>Configure requirements below to retrieve tailored recommendations.</span>
        </div>
        <div className="prompt-box-container">
            <label>🤖 Describe What You Need in Plain English</label>
            <div className="prompt-input-group">
              <input
                type="text"
                  placeholder="e.g. I need a gaming laptop for Valorant and video editing under ₹80k with 16GB RAM"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePromptParse()}
              />
              <button
                type="button"
                onClick={handlePromptParse}
                disabled={isParsingPrompt}
                className="prompt-parse-btn"
              >
                {isParsingPrompt ? "Parsing..." : "✨ Auto-Fill Form"}
              </button>
            </div>
        </div>        
        <div className="finder-card">
          <div className="filter-grid">
            <div className="form-group">
              <label>Intended Workload</label>
              <select name="usage" value={form.usage} onChange={handleChange}>
                <option value="">Select Usage</option>
                <option value="Student">Student</option>
                <option value="Coding">Coding</option>
                <option value="Gaming">Gaming</option>
                <option value="Editing">Editing</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="form-group">
              <label>Operating System</label>
              <select name="operatingSystem" value={form.operatingSystem} onChange={handleChange}>
                <option value="">Select OS</option>
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
              </select>
            </div>

            <div className="form-group">
              <label>RAM Capacity</label>
              <select name="ram" value={form.ram} onChange={handleChange}>
                <option value="">Select RAM</option>
                <option value="8 GB">8 GB</option>
                <option value="16 GB">16 GB</option>
                <option value="24 GB">24 GB</option>
                <option value="32 GB">32 GB</option>
                <option value="64 GB">64 GB</option>
              </select>
            </div>

            <div className="form-group">
              <label>Storage Size</label>
              <select name="storage" value={form.storage} onChange={handleChange}>
                <option value="">Select Storage</option>
                <option value="256 GB SSD">256 GB SSD</option>
                <option value="512 GB SSD">512 GB SSD</option>
                <option value="1 TB SSD">1 TB SSD</option>
                <option value="2 TB SSD">2 TB SSD</option>
              </select>
            </div>

            <div className="form-group">
              <label>Display Size</label>
              <select name="display" value={form.display} onChange={handleChange}>
                <option value="">Select Display</option>
                <option value="13.3 inch">13.3 inch</option>
                <option value="14 inch">14 inch</option>
                <option value="15.6 inch">15.6 inch</option>
                <option value="16 inch">16 inch</option>
                <option value="17.3 inch">17.3 inch</option>
              </select>
            </div>

            {/* INTERACTIVE BUDGET SLIDER */}
            <div className="form-group">
              <label>
                Max Budget Cap: <strong>₹{Number(form.maxBudget).toLocaleString("en-IN")}</strong>
              </label>
              <input
                type="range"
                name="maxBudget"
                min="30000"
                max="300000"
                step="5000"
                value={form.maxBudget}
                onChange={handleChange}
                className="budget-slider"
              />
            </div>
          </div>

          {/* PROCESSOR CONTROLS */}
          <div className="processor-section">
            <div className="subsection-title">
              <h3>⚙️ Processor Configuration</h3>
              <p>Configure processor architecture and generation.</p>
            </div>

            <div className="filter-grid">
              <div className="form-group">
                <label>Processor Brand</label>
                <select
                  name="processorBrand"
                  value={form.processorBrand}
                  onChange={handleChange}
                  disabled={!form.operatingSystem}
                >
                  <option value="">{!form.operatingSystem ? "Select OS first" : "Select Brand"}</option>
                  {availableProcessorBrands.map((brand) => (
                    <option value={brand} key={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Processor Tier</label>
                <select
                  name="processorSeries"
                  value={form.processorSeries}
                  onChange={handleChange}
                  disabled={!form.processorBrand}
                >
                  <option value="">{!form.processorBrand ? "Select Brand first" : "Select Series"}</option>
                  {processorSeries.map((series) => (
                    <option value={series} key={series}>{series}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Generation / Architecture</label>
                <select
                  name="processorGeneration"
                  value={form.processorGeneration}
                  onChange={handleChange}
                  disabled={!form.processorSeries}
                >
                  <option value="">{!form.processorSeries ? "Select Series first" : "Select Generation"}</option>
                  {processorGenerations.map((gen) => (
                    <option value={gen} key={gen}>{gen}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* GRAPHICS CONTROLS */}
          <div className="gpu-section">
            <div className="subsection-title">
              <h3>🎮 Graphics Configuration</h3>
              <p>Select preferred GPU model and brand tier.</p>
            </div>

            <div className="filter-grid">
              <div className="form-group">
                <label>GPU Brand</label>
                <select name="gpuBrand" value={form.gpuBrand} onChange={handleChange}>
                  <option value="">Select GPU Brand</option>
                  <option value="NVIDIA">NVIDIA</option>
                  <option value="AMD">AMD</option>
                  <option value="Intel">Intel</option>
                  <option value="Apple">Apple</option>
                </select>
              </div>

              <div className="form-group">
                <label>GPU Series</label>
                <select
                  name="gpuSeries"
                  value={form.gpuSeries}
                  onChange={handleChange}
                  disabled={!form.gpuBrand}
                >
                  <option value="">{!form.gpuBrand ? "Select Brand first" : "Select Series"}</option>
                  {gpuSeries.map((series) => (
                    <option value={series} key={series}>{series}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>GPU Model</label>
                <select
                  name="gpuModel"
                  value={form.gpuModel}
                  onChange={handleChange}
                  disabled={!form.gpuSeries}
                >
                  <option value="">{!form.gpuSeries ? "Select Series first" : "Select Model"}</option>
                  {gpuModels.map((model) => (
                    <option value={model} key={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="finder-actions">
            <button
              type="button"
              className="search-btn"
              onClick={handleSearch}
              disabled={isAiLoading}
            >
              {isAiLoading ? "🔄 Analyzing with Gemini AI..." : "✨ Analyze & Recommend with AI"}
            </button>

            <button
              type="button"
              className="share-btn"
              onClick={copyShareableLink}
            >
              {copiedLink ? "✓ Link Copied!" : "🔗 Share Config"}
            </button>

            <button
              type="button"
              className="reset-btn"
              onClick={resetForm}
              disabled={isAiLoading}
            >
              ↻ Reset
            </button>
          </div>
        </div>
      </section>

      {/* RESULTS DISPLAY */}
      {showResults && (
        <section className="results-section">
          <div className="section-heading">
            <p>{isAiDriven ? "AI ADVISORY DISCOVERY" : "FILTER ENGINE MATCHES"}</p>
            <h2>Top Recommended Laptops</h2>
            <span>
              {isAiDriven
                ? "Gemini AI analyzed your specs against the hardware catalogue and ranked the top performers below:"
                : showingAlternatives
                ? "No exact match was found. Showing closest hardware alternatives:"
                : "Based on your selected specifications:"}
            </span>
          </div>

          <div className="results-summary">
            <div>
              <strong>{results.length}</strong>
              <span>Laptops Recommended</span>
            </div>
            <div>
              <strong>{results.length > 0 ? `${results[0].matchScore}%` : "0%"}</strong>
              <span>Top Compatibility</span>
            </div>
          </div>

          <div className="laptop-results">
            {results.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No Laptops Available</h3>
                <p>No laptops met the selected specifications. Broaden your search criteria.</p>
                <button className="reset-results-btn" type="button" onClick={resetForm}>
                  Reset Filters
                </button>
              </div>
            ) : (
              results.map((laptop, index) => (
                <div className="laptop-card" key={laptop.id}>
                  <div className="laptop-image">
                    <div className="rank-badge">#{index + 1}</div>
                    <img
                      src={laptop.image}
                      alt={`${laptop.brand} ${laptop.model}`}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                  </div>

                  <div className="laptop-info">
                    <div className="match-row">
                      <span className="match-badge">{Math.min(laptop.matchScore, 100)}% Match</span>
                      {isAiDriven && <span className="ai-pick-badge">✨ AI Pick</span>}
                      {showingAlternatives && <span className="alt-pick-badge">Alternative</span>}
                    </div>

                    <h3>
                      {laptop.brand} {laptop.model}
                    </h3>

                    <p className="laptop-price">₹{laptop.price.toLocaleString("en-IN")}</p>

                    {laptop.aiVerdict && (
                      <div className="ai-verdict-box">
                        <strong>AI Analysis: </strong>
                        {laptop.aiVerdict}
                      </div>
                    )}

                    <div className="laptop-specs">
                      <span>⚙️ {laptop.processor} ({laptop.generation})</span>
                      <span>🎮 {laptop.gpu}</span>
                      <span>💾 {laptop.ram}</span>
                      <span>💽 {laptop.storage}</span>
                      <span>🖥️ {laptop.display}</span>
                    </div>

                    <div className="laptop-actions-grid">
                      <button
                        className="view-laptop-btn"
                        type="button"
                        onClick={() => setSelectedLaptop(laptop)}
                      >
                        Details
                      </button>

                      <button
                        className={`compare-btn ${
                          compareList.some((item) => item.id === laptop.id) ? "compare-selected" : ""
                        }`}
                        type="button"
                        onClick={() => toggleCompare(laptop)}
                      >
                        {compareList.some((item) => item.id === laptop.id) ? "✓ Added" : "+ Compare"}
                      </button>

                      <a
                        href={getBuyUrl(laptop)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="buy-amazon-btn"
                      >
                        🛒 Buy on Amazon
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* DETAILS MODAL */}
      {selectedLaptop && (
        <div className="modal-overlay" onClick={() => setSelectedLaptop(null)}>
          <div className="laptop-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedLaptop(null)}
            >
              ✕
            </button>

            <div className="modal-image">
              <img
                src={selectedLaptop.image}
                alt={`${selectedLaptop.brand} ${selectedLaptop.model}`}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60";
                }}
              />
            </div>

            <div className="modal-content">
              <div className="modal-top">
                <div>
                  <p className="modal-brand">{selectedLaptop.brand}</p>
                  <h2>{selectedLaptop.model}</h2>
                </div>
                <span className="modal-match">{selectedLaptop.matchScore}% Match</span>
              </div>

              <p className="modal-price">₹{selectedLaptop.price.toLocaleString("en-IN")}</p>

              {selectedLaptop.aiVerdict && (
                <div className="ai-verdict-box" style={{ margin: "12px 0 16px 0" }}>
                  <strong>Why AI recommended this: </strong>
                  {selectedLaptop.aiVerdict}
                </div>
              )}

              <div className="modal-spec-grid">
                <div>
                  <span>Operating System</span>
                  <strong>{selectedLaptop.os}</strong>
                </div>
                <div>
                  <span>Processor</span>
                  <strong>{selectedLaptop.processor}</strong>
                </div>
                <div>
                  <span>Generation</span>
                  <strong>{selectedLaptop.generation}</strong>
                </div>
                <div>
                  <span>Graphics</span>
                  <strong>{selectedLaptop.gpu}</strong>
                </div>
                <div>
                  <span>RAM</span>
                  <strong>{selectedLaptop.ram}</strong>
                </div>
                <div>
                  <span>Storage</span>
                  <strong>{selectedLaptop.storage}</strong>
                </div>
                <div>
                  <span>Display</span>
                  <strong>{selectedLaptop.display}</strong>
                </div>
                <div>
                  <span>Best For</span>
                  <strong>
                    {Array.isArray(selectedLaptop.usage)
                      ? selectedLaptop.usage.join(", ")
                      : selectedLaptop.usage}
                  </strong>
                </div>
              </div>

              <div className="modal-actions-container">
                <a
                  href={getBuyUrl(selectedLaptop)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-buy-btn"
                >
                  🛒 Buy Now on Amazon →
                </a>

                <button
                  className="modal-compare-btn"
                  type="button"
                  onClick={() => {
                    toggleCompare(selectedLaptop);
                    setSelectedLaptop(null);
                  }}
                >
                  {compareList.some((item) => item.id === selectedLaptop.id)
                    ? "✓ Already Added to Compare"
                    : "⚖️ Add to Compare"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARE MODAL */}
      {showCompare && (
        <div className="modal-overlay" onClick={() => setShowCompare(false)}>
          <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              type="button"
              onClick={() => setShowCompare(false)}
            >
              ✕
            </button>

            <div className="compare-header">
              <p>⚖️ SIDE-BY-SIDE HARDWARE COMPARISON</p>
              <h2>Compare Your Choices</h2>
              <span>Compare up to 3 laptops side by side.</span>
            </div>

            <div className="comparison-table">
              <div className="comparison-row comparison-heading">
                <div>Specification</div>
                {compareList.map((laptop) => (
                  <div key={laptop.id}>
                    {laptop.brand} {laptop.model}
                  </div>
                ))}
              </div>

              <div className="comparison-row">
                <div>Price</div>
                {compareList.map((laptop) => (
                  <div key={laptop.id}>₹{laptop.price.toLocaleString("en-IN")}</div>
                ))}
              </div>

              <div className="comparison-row">
                <div>Match Score</div>
                {compareList.map((laptop) => (
                  <div key={laptop.id}>
                    <span className="comparison-match">{laptop.matchScore}%</span>
                  </div>
                ))}
              </div>

              <div className="comparison-row">
                <div>Processor</div>
                {compareList.map((laptop) => (
                  <div key={laptop.id}>{laptop.processor}</div>
                ))}
              </div>

              <div className="comparison-row">
                <div>GPU</div>
                {compareList.map((laptop) => (
                  <div key={laptop.id}>{laptop.gpu}</div>
                ))}
              </div>

              <div className="comparison-row">
                <div>RAM</div>
                {compareList.map((laptop) => (
                  <div key={laptop.id}>{laptop.ram}</div>
                ))}
              </div>

              <div className="comparison-row">
                <div>Storage</div>
                {compareList.map((laptop) => (
                  <div key={laptop.id}>{laptop.storage}</div>
                ))}
              </div>

              <div className="comparison-row">
                <div>Action</div>
                {compareList.map((laptop) => (
                  <div key={laptop.id}>
                    <a
                      href={getBuyUrl(laptop)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="compare-buy-link"
                    >
                      Buy on Amazon →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM COMPARE BAR */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <div>
            <strong>⚖️ Compare Laptops</strong>
            <span>{compareList.length} / 3 selected</span>
          </div>

          <div className="compare-bar-actions">
            <button
              type="button"
              onClick={() => setCompareList([])}
              className="clear-compare-btn"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => setShowCompare(true)}
              className="open-compare-btn"
              disabled={compareList.length < 2}
            >
              Compare Now ({compareList.length}) →
            </button>
          </div>
        </div>
      )}

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="section-heading">
          <p>ABOUT LAPTOPFINDER AI</p>
          <h2>Data-Driven Hardware Guidance</h2>
          <span>
            Combining catalog accuracy with intelligent recommendation analysis to eliminate spec confusion, 
            avoid bottlenecks, and link you directly to store deals.
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <h3>💻 LaptopFinder AI</h3>
        <p>Find the machine built for your exact workflow.</p>
        <small>© 2026 LaptopFinder</small>
      </footer>
    </div>
  );
}

export default App;