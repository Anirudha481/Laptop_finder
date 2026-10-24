import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./App.css";

/* =========================================================
   API CONFIGURATION
========================================================= */
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://laptop-finder-api-jw07.onrender.com"
).replace(/\/+$/, "");

/* =========================================================
   CURATED PERSONA PRESETS (AI COPILOT CANVAS)
========================================================= */
const PERSONA_PRESETS = [
  {
    id: "student",
    icon: "💻",
    badge: "Popular for College",
    title: "B.Tech & CS Student",
    description: "Multitasking, Docker, IDEs & decent battery for campus life.",
    config: {
      usage: "Coding",
      operatingSystem: "Windows",
      processorBrand: "Intel",
      processorSeries: "Core i5",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "15.6 inch",
      maxBudget: 65000,
    },
    sampleQuery: "I need a durable coding laptop for computer science college under ₹65k with 16GB RAM and fast SSD.",
  },
  {
    id: "gaming",
    icon: "🎮",
    badge: "High FPS Gaming",
    title: "AAA Gaming Beast",
    description: "Dedicated RTX GPU, high refresh rate & aggressive thermal headroom.",
    config: {
      usage: "Gaming",
      operatingSystem: "Windows",
      gpuBrand: "NVIDIA",
      gpuSeries: "RTX 40 Series",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "15.6 inch",
      maxBudget: 85000,
    },
    sampleQuery: "Gaming laptop with RTX 40 Series GPU under ₹85,000 for competitive 1080p and 1440p gaming.",
  },
  {
    id: "macbook",
    icon: "🍏",
    badge: "Silent & Efficient",
    title: "Developer MacBook",
    description: "All-day battery life, Unix terminal, Liquid Retina & Apple Silicon.",
    config: {
      usage: "Coding",
      operatingSystem: "macOS",
      processorBrand: "Apple",
      processorSeries: "Apple Silicon",
      ram: "16 GB",
      storage: "512 GB SSD",
      display: "13.3 inch",
      maxBudget: 110000,
    },
    sampleQuery: "Apple MacBook with M-series silicon for fullstack software development and long battery life.",
  },
  {
    id: "creator",
    icon: "🎬",
    badge: "Studio Creative",
    title: "4K Creator & 3D Rig",
    description: "Color-accurate screen, 32GB RAM & GPU rendering for Premiere/Blender.",
    config: {
      usage: "Editing",
      operatingSystem: "Windows",
      gpuBrand: "NVIDIA",
      ram: "32 GB",
      storage: "1 TB SSD",
      display: "16 inch",
      maxBudget: 140000,
    },
    sampleQuery: "High-spec laptop with 32GB RAM and dedicated NVIDIA graphics for 4K video editing and Blender 3D under ₹1.4L.",
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
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=70",
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
    rating: 4.3,
  },
  {
    id: 2,
    brand: "Lenovo",
    model: "IdeaPad Slim 3 i3 13th Gen",
    price: 39990,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=70",
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
    rating: 4.2,
  },
  {
    id: 5,
    brand: "ASUS",
    model: "Vivobook 15 i5 13th Gen",
    price: 54990,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=70",
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
    rating: 4.5,
  },
  {
    id: 12,
    brand: "Lenovo",
    model: "LOQ 15 i7 13th Gen",
    price: 79990,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=70",
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
    rating: 4.7,
  },
  {
    id: 30,
    brand: "ASUS",
    model: "TUF Gaming A16 Advantage",
    price: 89990,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=70",
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
    rating: 4.6,
  },
  {
    id: 44,
    brand: "Apple",
    model: "MacBook Air M4 (13-inch)",
    price: 99990,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=70",
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
    rating: 4.9,
  },
  {
    id: 20,
    brand: "MSI",
    model: "Raider GE78 HX RTX 4080",
    price: 249990,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=70",
    os: "Windows",
    processorBrand: "Intel",
    processor: "Core i7",
    generation: "13th Gen",
    gpuBrand: "NVIDIA",
    gpuSeries: "RTX 40 Series",
    gpu: "RTX 4080",
    ram: "32 GB",
    storage: "2 TB SSD",
    display: "17.3 inch",
    usage: ["Gaming", "Editing", "Design"],
    rating: 4.8,
  },
  {
    id: 45,
    brand: "Apple",
    model: "MacBook Pro 16 M3 Pro",
    price: 219990,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=70",
    os: "macOS",
    processorBrand: "Apple",
    processor: "Apple Silicon",
    generation: "M3",
    gpuBrand: "Apple",
    gpuSeries: "Apple GPU",
    gpu: "Apple GPU",
    ram: "36 GB",
    storage: "1 TB SSD",
    display: "16 inch",
    usage: ["Editing", "Coding", "Design"],
    rating: 4.9,
  },
];

/* =========================================================
   HARDWARE ARCHITECTURE HIERARCHY
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

const USAGE_OPTIONS = [
  { label: "Coding", icon: "💻" },
  { label: "Gaming", icon: "🎮" },
  { label: "Student", icon: "🎓" },
  { label: "Editing", icon: "🎬" },
  { label: "Design", icon: "🎨" },
  { label: "Business", icon: "💼" },
];

const RAM_OPTIONS = ["8 GB", "16 GB", "24 GB", "32 GB", "64 GB"];
const STORAGE_OPTIONS = ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"];
const DISPLAY_OPTIONS = ["13.3 inch", "14 inch", "15.6 inch", "16 inch", "17.3 inch"];

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("laptopfinder-theme") !== "light"; // default to dark
  });

  const [laptops, setLaptops] = useState(fallbackLaptops);
  const [results, setResults] = useState(() =>
    fallbackLaptops.map((l) => ({
      ...l,
      matchScore: 90,
      aiVerdict: `Equipped with ${l.processor} and ${l.gpu}, providing balanced performance for daily workloads.`,
    }))
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiDriven, setIsAiDriven] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePersona, setActivePersona] = useState(null);
  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);
  const [sortBy, setSortBy] = useState("match"); // 'match', 'price-asc', 'price-desc'

  const [form, setForm] = useState(() => {
    const defaultForm = {
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
      maxBudget: 120000,
    };
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of params.entries()) {
        if (key in defaultForm) {
          defaultForm[key] = key === "maxBudget" ? Number(value) : value;
        }
      }
    }
    return defaultForm;
  });

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

  // Sync theme
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("laptopfinder-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch initial catalogue
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

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
          console.warn("Backend API offline or waking up; using curated local catalogue.", err);
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

  // Cascading processor brands
  let availableProcessorBrands = [];
  if (form.operatingSystem === "Windows") availableProcessorBrands = ["Intel", "AMD"];
  else if (form.operatingSystem === "macOS") availableProcessorBrands = ["Apple"];
  else availableProcessorBrands = ["Intel", "AMD", "Apple"];

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

  // Local fallback / instant filter scorer
  const computeScoredLaptops = useCallback(
    (targetForm = form, targetLaptops = laptops) => {
      const budgetCap = Number(targetForm.maxBudget) || 120000;
      return targetLaptops
        .map((laptop) => {
          let score = 0;
          let totalWeight = 0;

          const checkMatch = (selected, actual, weight) => {
            if (!selected) return;
            totalWeight += weight;
            if (selected.toLowerCase() === String(actual).toLowerCase()) score += weight;
          };

          checkMatch(targetForm.operatingSystem, laptop.os, 3);
          checkMatch(targetForm.processorBrand, laptop.processorBrand, 3);
          checkMatch(targetForm.processorSeries, laptop.processor, 4);
          checkMatch(targetForm.processorGeneration, laptop.generation, 3);
          checkMatch(targetForm.gpuBrand, laptop.gpuBrand, 3);
          checkMatch(targetForm.gpuSeries, laptop.gpuSeries, 4);
          checkMatch(targetForm.gpuModel, laptop.gpu, 5);
          checkMatch(targetForm.ram, laptop.ram, 2);
          checkMatch(targetForm.storage, laptop.storage, 2);
          checkMatch(targetForm.display, laptop.display, 2);

          if (targetForm.usage) {
            totalWeight += 3;
            if (Array.isArray(laptop.usage) && laptop.usage.includes(targetForm.usage)) score += 3;
          }

          // Price penalty if above budget
          if (laptop.price <= budgetCap) {
            score += 2;
            totalWeight += 2;
          } else {
            totalWeight += 4;
          }

          const matchScore = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 88;

          return {
            ...laptop,
            matchScore: Math.min(Math.max(matchScore, 40), 99),
            aiVerdict:
              laptop.aiVerdict ||
              `Equipped with ${laptop.processor} and ${laptop.gpu}, providing balanced performance for ${
                targetForm.usage ? targetForm.usage.toLowerCase() : "daily high-efficiency workloads"
              }.`,
          };
        })
        .filter((l) => l.price <= budgetCap + 15000); // Allow slight leeway for top alternative
    },
    [form, laptops]
  );


  // Execute Local Search
  const executeLocalFallbackSearch = () => {
    const scored = computeScoredLaptops().sort((a, b) => b.matchScore - a.matchScore);
    setIsAiDriven(false);
    setShowingAlternatives(true);
    setResults(scored);
  };

  // Trigger AI recommendation
  const handleSearch = async () => {
    setIsAiLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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
      } else {
        throw new Error("No laptops returned from AI");
      }
    } catch (err) {
      console.warn("AI recommendation endpoint unreachable. Initiating instant local engine:", err);
      executeLocalFallbackSearch();
    } finally {
      clearTimeout(timeoutId);
      setIsAiLoading(false);
      setTimeout(() => {
        const resultsEl = document.getElementById("results");
        if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // Natural Language Prompt Parsing
  const handlePromptParse = async (overrideText) => {
    const query = (overrideText || promptText).trim();
    if (!query) return;
    setIsParsingPrompt(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/parse-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText: query }),
      });

      const data = await response.json();
      if (data.success && data.filters) {
        setForm((prev) => ({
          ...prev,
          ...data.filters,
        }));
        // Auto trigger search after brief state sync
        setTimeout(() => handleSearch(), 100);
      } else {
        // Simple local keyword heuristic if backend parse fails
        applyHeuristicPrompt(query);
      }
    } catch (err) {
      console.warn("AI prompt parse failed. Using smart client heuristic:", err);
      applyHeuristicPrompt(query);
    } finally {
      setIsParsingPrompt(false);
    }
  };

  const applyHeuristicPrompt = (text) => {
    const lower = text.toLowerCase();
    const updated = { ...form };

    if (lower.includes("mac") || lower.includes("apple")) {
      updated.operatingSystem = "macOS";
      updated.processorBrand = "Apple";
    } else if (lower.includes("windows")) {
      updated.operatingSystem = "Windows";
    }

    if (lower.includes("gaming") || lower.includes("fps") || lower.includes("rtx")) {
      updated.usage = "Gaming";
      updated.gpuBrand = "NVIDIA";
    } else if (lower.includes("code") || lower.includes("programming") || lower.includes("student")) {
      updated.usage = "Coding";
    } else if (lower.includes("edit") || lower.includes("video") || lower.includes("render")) {
      updated.usage = "Editing";
    }

    if (lower.includes("32gb") || lower.includes("32 gb")) updated.ram = "32 GB";
    else if (lower.includes("16gb") || lower.includes("16 gb")) updated.ram = "16 GB";
    else if (lower.includes("8gb") || lower.includes("8 gb")) updated.ram = "8 GB";

    // Extract budget like 80k, 80000, 1.2L
    const budgetMatch = text.match(/(?:under|below|budget|around)?\s*₹?\s*(\d{1,2}(?:\.\d+)?)\s*(k|l|lakh)?/i);
    if (budgetMatch) {
      let num = parseFloat(budgetMatch[1]);
      let unit = (budgetMatch[2] || "").toLowerCase();
      if (unit === "k") num *= 1000;
      else if (unit === "l" || unit === "lakh") num *= 100000;
      else if (num < 500) num *= 1000;
      if (num >= 30000 && num <= 400000) updated.maxBudget = num;
    }

    setForm(updated);
    setTimeout(() => executeLocalFallbackSearch(), 100);
  };

  // Handle Form Change
  const handleChange = (name, value) => {
    setActivePersona(null);
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "operatingSystem") {
        if (value === "Windows" && updated.processorBrand === "Apple") {
          updated.processorBrand = "";
        }
        if (value === "macOS") {
          updated.processorBrand = "Apple";
          updated.processorSeries = "Apple Silicon";
          updated.gpuBrand = "Apple";
        }
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

  // Apply Persona Preset
  const handleApplyPersona = (preset) => {
    setActivePersona(preset.id);
    setPromptText(preset.sampleQuery);
    setForm((prev) => ({
      ...prev,
      ...preset.config,
    }));
    // Scroll down to Studio smoothly
    const studioEl = document.getElementById("studio");
    if (studioEl) studioEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Reset Everything
  const resetForm = () => {
    setActivePersona(null);
    setPromptText("");
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
      maxBudget: 120000,
    });
    setShowingAlternatives(false);
    setIsAiDriven(false);
    window.history.replaceState({}, document.title, window.location.pathname);
    const initial = fallbackLaptops.map((l) => ({ ...l, matchScore: 90 }));
    setResults(initial);
  };

  // Share Configuration Link
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

  // Compare Toggle
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

  // Sorted Results
  const sortedResults = useMemo(() => {
    const copy = [...results];
    if (sortBy === "price-asc") {
      return copy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return copy.sort((a, b) => b.price - a.price);
    }
    // default: match score
    return copy.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [results, sortBy]);

  // Active filters count for studio badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (form.usage) count++;
    if (form.operatingSystem) count++;
    if (form.ram) count++;
    if (form.storage) count++;
    if (form.display) count++;
    if (form.processorBrand) count++;
    if (form.gpuBrand) count++;
    return count;
  }, [form]);

  return (
    <div className="app">
      {/* =========================================================
          NAVBAR (SLEEK FROSTED GLASS)
      ========================================================= */}
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-logo-icon">💻</span>
            <span className="brand-title">LaptopFinder<span className="brand-badge-ai">AI</span></span>
          </div>

          <nav className="nav-menu">
            <a href="#copilot" className="nav-link">AI Copilot</a>
            <a href="#personas" className="nav-link">Personas</a>
            <a href="#studio" className="nav-link">Hardware Studio</a>
            <a href="#results" className="nav-link">
              Catalogue
              {results.length > 0 && <span className="nav-count-badge">{results.length}</span>}
            </a>
          </nav>

          <div className="nav-actions">
            {compareList.length > 0 && (
              <button
                type="button"
                className="nav-compare-btn"
                onClick={() => setShowCompare(true)}
              >
                ⚖️ Compare ({compareList.length})
              </button>
            )}

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO SECTION (AI COPILOT CANVAS - OPTION 3)
      ========================================================= */}
      <section className="copilot-hero" id="copilot">
        <div className="hero-glow-orb"></div>
        <div className="hero-glow-orb-secondary"></div>

        <div className="hero-inner">
          <div className="hero-pill-badge">
            <span className="pulse-dot"></span>
            NEXT-GEN HARDWARE DISCOVERY & ADVISORY
          </div>

          <h1 className="hero-heading">
            Find the Perfect Machine.
            <br />
            <span className="gradient-text">Architected by AI.</span>
          </h1>

          <p className="hero-subtext">
            Prompt in plain English or tune specs in our studio. Our AI evaluates bottlenecks,
            matches workflows, and guides you to verified Amazon store listings.
          </p>

          {/* FLOATING PROMPT SEARCH BAR */}
          <div className="copilot-search-wrapper">
            <div className="copilot-search-card">
              <span className="copilot-icon">✨</span>
              <input
                type="text"
                className="copilot-input"
                placeholder="Describe what you need (e.g. Gaming rig for Valorant & Premiere under ₹80k with 16GB RAM)..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePromptParse()}
              />
              {promptText && (
                <button
                  type="button"
                  className="clear-input-btn"
                  onClick={() => setPromptText("")}
                  title="Clear input"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                className="copilot-submit-btn"
                onClick={() => handlePromptParse()}
                disabled={isParsingPrompt || !promptText.trim()}
              >
                {isParsingPrompt ? (
                  <>
                    <span className="spinner"></span> Parsing Intent...
                  </>
                ) : (
                  <>Auto-Tune with AI →</>
                )}
              </button>
            </div>

            {/* QUICK PROMPT SUGGESTION CHIPS */}
            <div className="prompt-suggestions">
              <span className="suggestions-label">Try asking:</span>
              <button
                type="button"
                className="prompt-chip"
                onClick={() => {
                  const q = "Sub-₹70k laptop for B.Tech CS college with 16GB RAM and great battery life";
                  setPromptText(q);
                  handlePromptParse(q);
                }}
              >
                🎓 CS Student under ₹70k
              </button>
              <button
                type="button"
                className="prompt-chip"
                onClick={() => {
                  const q = "Gaming laptop with RTX 4060 GPU and high refresh rate under ₹85k";
                  setPromptText(q);
                  handlePromptParse(q);
                }}
              >
                🎮 RTX 4060 Gaming rig
              </button>
              <button
                type="button"
                className="prompt-chip"
                onClick={() => {
                  const q = "MacBook Air M4 for programming and silent workflow";
                  setPromptText(q);
                  handlePromptParse(q);
                }}
              >
                🍏 MacBook Air M-Series
              </button>
              <button
                type="button"
                className="prompt-chip"
                onClick={() => {
                  const q = "Workstation with 32GB RAM for 4K video editing and 3D modeling";
                  setPromptText(q);
                  handlePromptParse(q);
                }}
              >
                🎬 32GB 4K Video Workstation
              </button>
            </div>
          </div>

          {/* CURATED PERSONA QUICK-START CARDS */}
          <div className="personas-container" id="personas">
            <div className="personas-header">
              <span className="sub-header-tag">POPULAR BLUEPRINTS</span>
              <h2 className="sub-header-title">Select a Curated Persona</h2>
            </div>

            <div className="personas-grid">
              {PERSONA_PRESETS.map((p) => {
                const isActive = activePersona === p.id;
                return (
                  <div
                    key={p.id}
                    className={`persona-card ${isActive ? "persona-active" : ""}`}
                    onClick={() => handleApplyPersona(p)}
                  >
                    <div className="persona-top">
                      <span className="persona-icon">{p.icon}</span>
                      <span className="persona-badge">{p.badge}</span>
                    </div>
                    <h3 className="persona-title">{p.title}</h3>
                    <p className="persona-desc">{p.description}</p>
                    <div className="persona-footer">
                      <span className="persona-budget">Max ₹{p.config.maxBudget.toLocaleString("en-IN")}</span>
                      <span className="persona-select-cta">
                        {isActive ? "✓ Selected" : "Apply Specs →"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STUDIO WORKSTATION LAYOUT (OPTION 2: SPLIT SCREEN)
      ========================================================= */}
      <main className="studio-workspace" id="studio">
        <div className="studio-container">
          {/* LEFT: STICKY FILTER STUDIO */}
          <aside className="studio-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <div>
                  <h2 className="sidebar-title">⚙️ Hardware Studio</h2>
                  <p className="sidebar-subtitle">Fine-tune your machine constraints</p>
                </div>
                {activeFiltersCount > 0 && (
                  <span className="filter-count-pill">{activeFiltersCount} active</span>
                )}
              </div>

              {/* BUDGET CAP SLIDER */}
              <div className="filter-block">
                <div className="slider-header">
                  <label className="filter-label">Max Budget Cap</label>
                  <span className="budget-value-tag">
                    ₹{Number(form.maxBudget).toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="300000"
                  step="5000"
                  value={form.maxBudget}
                  onChange={(e) => handleChange("maxBudget", Number(e.target.value))}
                  className="modern-range-slider"
                />
                <div className="budget-quick-pills">
                  {[50000, 80000, 120000, 200000].map((b) => (
                    <button
                      key={b}
                      type="button"
                      className={`quick-budget-btn ${form.maxBudget === b ? "active" : ""}`}
                      onClick={() => handleChange("maxBudget", b)}
                    >
                      ₹{b / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* WORKLOAD PILLS */}
              <div className="filter-block">
                <label className="filter-label">Primary Workload</label>
                <div className="pill-group">
                  {USAGE_OPTIONS.map((u) => (
                    <button
                      key={u.label}
                      type="button"
                      className={`pill-option ${form.usage === u.label ? "selected" : ""}`}
                      onClick={() => handleChange("usage", form.usage === u.label ? "" : u.label)}
                    >
                      <span className="pill-icon">{u.icon}</span>
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* OPERATING SYSTEM */}
              <div className="filter-block">
                <label className="filter-label">Operating System</label>
                <div className="segmented-switch">
                  <button
                    type="button"
                    className={`segmented-btn ${form.operatingSystem === "" ? "active" : ""}`}
                    onClick={() => handleChange("operatingSystem", "")}
                  >
                    Any OS
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${form.operatingSystem === "Windows" ? "active" : ""}`}
                    onClick={() => handleChange("operatingSystem", "Windows")}
                  >
                    🪟 Windows
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${form.operatingSystem === "macOS" ? "active" : ""}`}
                    onClick={() => handleChange("operatingSystem", "macOS")}
                  >
                    🍏 macOS
                  </button>
                </div>
              </div>

              {/* RAM SELECTOR */}
              <div className="filter-block">
                <label className="filter-label">Memory (RAM)</label>
                <div className="pill-group-compact">
                  {RAM_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`compact-pill ${form.ram === r ? "selected" : ""}`}
                      onClick={() => handleChange("ram", form.ram === r ? "" : r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* STORAGE SELECTOR */}
              <div className="filter-block">
                <label className="filter-label">Storage Capacity</label>
                <div className="pill-group-compact">
                  {STORAGE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`compact-pill ${form.storage === s ? "selected" : ""}`}
                      onClick={() => handleChange("storage", form.storage === s ? "" : s)}
                    >
                      {s.replace(" SSD", "")}
                    </button>
                  ))}
                </div>
              </div>

              {/* DISPLAY SIZE */}
              <div className="filter-block">
                <label className="filter-label">Display Size</label>
                <div className="pill-group-compact">
                  {DISPLAY_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`compact-pill ${form.display === d ? "selected" : ""}`}
                      onClick={() => handleChange("display", form.display === d ? "" : d)}
                    >
                      {d.replace(" inch", '"')}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLLAPSIBLE ADVANCED HARDWARE (CPU / GPU) */}
              <div className="advanced-accordion">
                <button
                  type="button"
                  className="accordion-toggle"
                  onClick={() => setShowAdvancedSpecs(!showAdvancedSpecs)}
                >
                  <span>⚡ Advanced Silicon & GPU Tuning</span>
                  <span className={`accordion-arrow ${showAdvancedSpecs ? "open" : ""}`}>▾</span>
                </button>

                {showAdvancedSpecs && (
                  <div className="accordion-content">
                    {/* PROCESSOR */}
                    <div className="form-sub-group">
                      <label className="sub-label">Processor Brand</label>
                      <select
                        className="custom-select"
                        value={form.processorBrand}
                        onChange={(e) => handleChange("processorBrand", e.target.value)}
                      >
                        <option value="">Any Brand</option>
                        {availableProcessorBrands.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-sub-group">
                      <label className="sub-label">Processor Series</label>
                      <select
                        className="custom-select"
                        value={form.processorSeries}
                        onChange={(e) => handleChange("processorSeries", e.target.value)}
                        disabled={!form.processorBrand}
                      >
                        <option value="">{!form.processorBrand ? "Select Brand first" : "Any Series"}</option>
                        {processorSeries.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-sub-group">
                      <label className="sub-label">Generation</label>
                      <select
                        className="custom-select"
                        value={form.processorGeneration}
                        onChange={(e) => handleChange("processorGeneration", e.target.value)}
                        disabled={!form.processorSeries}
                      >
                        <option value="">{!form.processorSeries ? "Select Series first" : "Any Generation"}</option>
                        {processorGenerations.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    {/* GPU */}
                    <div className="form-sub-group" style={{ marginTop: "1rem" }}>
                      <label className="sub-label">Graphics Brand</label>
                      <select
                        className="custom-select"
                        value={form.gpuBrand}
                        onChange={(e) => handleChange("gpuBrand", e.target.value)}
                      >
                        <option value="">Any GPU</option>
                        <option value="NVIDIA">NVIDIA</option>
                        <option value="AMD">AMD</option>
                        <option value="Intel">Intel</option>
                        <option value="Apple">Apple</option>
                      </select>
                    </div>

                    <div className="form-sub-group">
                      <label className="sub-label">GPU Series</label>
                      <select
                        className="custom-select"
                        value={form.gpuSeries}
                        onChange={(e) => handleChange("gpuSeries", e.target.value)}
                        disabled={!form.gpuBrand}
                      >
                        <option value="">{!form.gpuBrand ? "Select GPU Brand first" : "Any GPU Series"}</option>
                        {gpuSeries.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-sub-group">
                      <label className="sub-label">GPU Model</label>
                      <select
                        className="custom-select"
                        value={form.gpuModel}
                        onChange={(e) => handleChange("gpuModel", e.target.value)}
                        disabled={!form.gpuSeries}
                      >
                        <option value="">{!form.gpuSeries ? "Select Series first" : "Any Model"}</option>
                        {gpuModels.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* SIDEBAR ACTIONS */}
              <div className="sidebar-actions">
                <button
                  type="button"
                  className="primary-action-btn"
                  onClick={handleSearch}
                  disabled={isAiLoading}
                >
                  {isAiLoading ? (
                    <>
                      <span className="spinner"></span> AI Analyzing...
                    </>
                  ) : (
                    <>✨ Recommend with AI</>
                  )}
                </button>

                <div className="secondary-actions-row">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={copyShareableLink}
                    title="Copy shareable URL link"
                  >
                    {copiedLink ? "✓ Copied!" : "🔗 Share Config"}
                  </button>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={resetForm}
                    title="Reset all filters"
                  >
                    ↻ Reset
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: SHOWCASE SHOWROOM */}
          <section className="studio-main" id="results">
            {/* RESULTS STATUS BAR */}
            <div className="results-toolbar">
              <div className="toolbar-left">
                <div className="engine-status-tag">
                  {isAiDriven ? (
                    <span className="tag-ai">✨ AI Recommendation Engine</span>
                  ) : showingAlternatives ? (
                    <span className="tag-alt">⚡ Smart Alternative Matches</span>
                  ) : (
                    <span className="tag-live">● Live Studio Catalog</span>
                  )}
                </div>
                <h2 className="results-headline">
                  Top Recommended Machines
                  <span className="results-count-text">({sortedResults.length} laptops)</span>
                </h2>
              </div>

              {/* SORT CONTROLS */}
              <div className="toolbar-right">
                <label className="sort-label">Sort by:</label>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="match">Highest Match %</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* ACTIVE FILTER DISMISSIBLE CHIPS */}
            {activeFiltersCount > 0 && (
              <div className="active-filters-bar">
                <span className="active-filters-label">Active filters:</span>
                {form.usage && (
                  <button
                    type="button"
                    className="dismiss-filter-chip"
                    onClick={() => handleChange("usage", "")}
                  >
                    Workload: {form.usage} ✕
                  </button>
                )}
                {form.operatingSystem && (
                  <button
                    type="button"
                    className="dismiss-filter-chip"
                    onClick={() => handleChange("operatingSystem", "")}
                  >
                    OS: {form.operatingSystem} ✕
                  </button>
                )}
                {form.ram && (
                  <button
                    type="button"
                    className="dismiss-filter-chip"
                    onClick={() => handleChange("ram", "")}
                  >
                    RAM: {form.ram} ✕
                  </button>
                )}
                {form.storage && (
                  <button
                    type="button"
                    className="dismiss-filter-chip"
                    onClick={() => handleChange("storage", "")}
                  >
                    Storage: {form.storage} ✕
                  </button>
                )}
                {form.display && (
                  <button
                    type="button"
                    className="dismiss-filter-chip"
                    onClick={() => handleChange("display", "")}
                  >
                    Display: {form.display} ✕
                  </button>
                )}
                {form.processorBrand && (
                  <button
                    type="button"
                    className="dismiss-filter-chip"
                    onClick={() => handleChange("processorBrand", "")}
                  >
                    CPU: {form.processorBrand} ✕
                  </button>
                )}
                {form.gpuBrand && (
                  <button
                    type="button"
                    className="dismiss-filter-chip"
                    onClick={() => handleChange("gpuBrand", "")}
                  >
                    GPU: {form.gpuBrand} ✕
                  </button>
                )}
                <button
                  type="button"
                  className="clear-all-text-btn"
                  onClick={resetForm}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* LAPTOP GRID */}
            {sortedResults.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-icon">🔍</div>
                <h3>No exact hardware match found</h3>
                <p>Try increasing your budget cap or loosening specific processor/GPU tier requirements.</p>
                <button
                  type="button"
                  className="reset-filters-cta"
                  onClick={resetForm}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="laptop-grid">
                {sortedResults.map((laptop, index) => {
                  const isCompared = compareList.some((item) => item.id === laptop.id);
                  const isTopPick = index === 0 && (laptop.matchScore || 0) >= 80;

                  return (
                    <article className="laptop-showcase-card" key={laptop.id}>
                      {/* CARD IMAGE & BADGES */}
                      <div className="card-image-wrap">
                        <div className="card-floating-badges">
                          <span className="rank-indicator">#{index + 1}</span>
                          {isTopPick && <span className="top-pick-badge">✨ Top Match</span>}
                          {isAiDriven && <span className="ai-verified-badge">AI Pick</span>}
                        </div>

                        <img
                          src={laptop.image}
                          alt={`${laptop.brand} ${laptop.model}`}
                          className="laptop-product-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=70";
                          }}
                        />

                        {/* MATCH SCORE PILL */}
                        <div className="match-score-bubble">
                          <span className="match-num">{laptop.matchScore || 88}%</span>
                          <span className="match-lbl">Match</span>
                        </div>
                      </div>

                      {/* CARD BODY */}
                      <div className="card-content">
                        <div className="card-brand-row">
                          <span className="brand-tag">{laptop.brand}</span>
                          <span className="laptop-os-tag">{laptop.os}</span>
                        </div>

                        <h3 className="laptop-title">{laptop.model}</h3>

                        <div className="price-row">
                          <span className="price-label">Price:</span>
                          <span className="price-figure">₹{laptop.price.toLocaleString("en-IN")}</span>
                        </div>

                        {/* AI VERDICT CALLOUT */}
                        {laptop.aiVerdict && (
                          <div className="ai-verdict-callout">
                            <span className="ai-sparkle">💡</span>
                            <p className="ai-verdict-text">{laptop.aiVerdict}</p>
                          </div>
                        )}

                        {/* HARDWARE TAGS MATRIX */}
                        <div className="hardware-specs-matrix">
                          <div className="spec-tag" title="Processor">
                            <span className="spec-icon">⚙️</span>
                            <span className="spec-val">{laptop.processor}</span>
                          </div>
                          <div className="spec-tag" title="Graphics">
                            <span className="spec-icon">🎮</span>
                            <span className="spec-val">{laptop.gpu}</span>
                          </div>
                          <div className="spec-tag" title="RAM">
                            <span className="spec-icon">💾</span>
                            <span className="spec-val">{laptop.ram}</span>
                          </div>
                          <div className="spec-tag" title="Storage">
                            <span className="spec-icon">💽</span>
                            <span className="spec-val">{laptop.storage}</span>
                          </div>
                          <div className="spec-tag" title="Display">
                            <span className="spec-icon">🖥️</span>
                            <span className="spec-val">{laptop.display}</span>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="card-actions">
                          <button
                            type="button"
                            className="btn-quick-view"
                            onClick={() => setSelectedLaptop(laptop)}
                          >
                            Quick View
                          </button>

                          <button
                            type="button"
                            className={`btn-compare-toggle ${isCompared ? "active" : ""}`}
                            onClick={() => toggleCompare(laptop)}
                          >
                            {isCompared ? "✓ In Compare" : "+ Compare"}
                          </button>

                          <a
                            href={getBuyUrl(laptop)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-buy-amazon"
                          >
                            <span>🛒 Buy</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* =========================================================
          FLOATING DYNAMIC COMPARISON ISLAND (APPLE DYNAMIC ISLAND STYLE)
      ========================================================= */}
      {compareList.length > 0 && (
        <aside className="floating-compare-dock" aria-label="Comparison Dock">
          <div className="dock-content">
            <div className="dock-thumbs">
              {compareList.map((item) => (
                <div key={item.id} className="dock-avatar" title={`${item.brand} ${item.model}`}>
                  <img src={item.image} alt={item.model} />
                  <button
                    type="button"
                    className="dock-remove-item"
                    onClick={() => toggleCompare(item)}
                    title="Remove from comparison"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="dock-info">
              <span className="dock-title">⚖️ Compare Laptops</span>
              <span className="dock-count">{compareList.length} of 3 selected</span>
            </div>

            <div className="dock-actions">
              <button
                type="button"
                className="dock-clear-btn"
                onClick={() => setCompareList([])}
              >
                Clear
              </button>

              <button
                type="button"
                className="dock-compare-btn"
                onClick={() => setShowCompare(true)}
              >
                Compare Side-by-Side →
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* =========================================================
          SIDE-BY-SIDE COMPARISON MODAL
      ========================================================= */}
      {showCompare && (
        <div className="modal-backdrop" onClick={() => setShowCompare(false)}>
          <div className="compare-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div>
                <span className="dialog-kicker">HARDWARE BENCHMARK COMPARISON</span>
                <h2 className="dialog-title">Side-by-Side Match Up</h2>
              </div>
              <button
                type="button"
                className="dialog-close-btn"
                onClick={() => setShowCompare(false)}
              >
                ✕
              </button>
            </div>

            <div className="table-wrapper">
              <table className="compare-grid-table">
                <thead>
                  <tr>
                    <th>Specification</th>
                    {compareList.map((l) => (
                      <th key={l.id}>
                        <div className="th-laptop-header">
                          <img src={l.image} alt={l.model} className="th-img" />
                          <span className="th-brand">{l.brand}</span>
                          <span className="th-model">{l.model}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-label">Price</td>
                    {compareList.map((l) => (
                      <td key={l.id} className="row-price">
                        ₹{l.price.toLocaleString("en-IN")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Compatibility</td>
                    {compareList.map((l) => (
                      <td key={l.id}>
                        <span className="table-match-badge">{l.matchScore || 85}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Processor</td>
                    {compareList.map((l) => (
                      <td key={l.id}>
                        <strong>{l.processor}</strong>
                        <div className="sub-spec">{l.generation}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Graphics (GPU)</td>
                    {compareList.map((l) => (
                      <td key={l.id}>
                        <strong>{l.gpu}</strong>
                        <div className="sub-spec">{l.gpuBrand}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Memory (RAM)</td>
                    {compareList.map((l) => (
                      <td key={l.id}>{l.ram}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Storage</td>
                    {compareList.map((l) => (
                      <td key={l.id}>{l.storage}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Display</td>
                    {compareList.map((l) => (
                      <td key={l.id}>{l.display}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Purchase</td>
                    {compareList.map((l) => (
                      <td key={l.id}>
                        <a
                          href={getBuyUrl(l)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-buy-btn"
                        >
                          Buy on Amazon →
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          LAPTOP QUICK VIEW / DETAILS MODAL
      ========================================================= */}
      {selectedLaptop && (
        <div className="modal-backdrop" onClick={() => setSelectedLaptop(null)}>
          <div className="details-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dialog-close-btn"
              onClick={() => setSelectedLaptop(null)}
            >
              ✕
            </button>

            <div className="details-split">
              {/* LEFT IMAGE SHOWCASE */}
              <div className="details-media">
                <img
                  src={selectedLaptop.image}
                  alt={`${selectedLaptop.brand} ${selectedLaptop.model}`}
                  className="details-img"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=70";
                  }}
                />
                <div className="details-badge-row">
                  <span className="details-match-badge">
                    {selectedLaptop.matchScore || 90}% Hardware Compatibility
                  </span>
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="details-body">
                <span className="details-brand-kicker">{selectedLaptop.brand} • {selectedLaptop.os}</span>
                <h2 className="details-title">{selectedLaptop.model}</h2>
                <div className="details-price">₹{selectedLaptop.price.toLocaleString("en-IN")}</div>

                {/* AI VERDICT */}
                {selectedLaptop.aiVerdict && (
                  <div className="details-ai-box">
                    <span className="details-ai-sparkle">✨</span>
                    <div>
                      <strong>AI Workflow Analysis</strong>
                      <p>{selectedLaptop.aiVerdict}</p>
                    </div>
                  </div>
                )}

                {/* SPECIFICATION GRID */}
                <div className="details-spec-grid">
                  <div className="details-spec-item">
                    <span className="spec-item-name">Processor</span>
                    <strong className="spec-item-val">{selectedLaptop.processor} ({selectedLaptop.generation})</strong>
                  </div>
                  <div className="details-spec-item">
                    <span className="spec-item-name">Graphics</span>
                    <strong className="spec-item-val">{selectedLaptop.gpu}</strong>
                  </div>
                  <div className="details-spec-item">
                    <span className="spec-item-name">RAM</span>
                    <strong className="spec-item-val">{selectedLaptop.ram}</strong>
                  </div>
                  <div className="details-spec-item">
                    <span className="spec-item-name">Storage</span>
                    <strong className="spec-item-val">{selectedLaptop.storage}</strong>
                  </div>
                  <div className="details-spec-item">
                    <span className="spec-item-name">Display Size</span>
                    <strong className="spec-item-val">{selectedLaptop.display}</strong>
                  </div>
                  <div className="details-spec-item">
                    <span className="spec-item-name">Best Workloads</span>
                    <strong className="spec-item-val">
                      {Array.isArray(selectedLaptop.usage)
                        ? selectedLaptop.usage.join(", ")
                        : selectedLaptop.usage}
                    </strong>
                  </div>
                </div>

                {/* DETAILS ACTIONS */}
                <div className="details-actions">
                  <a
                    href={getBuyUrl(selectedLaptop)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="details-buy-btn"
                  >
                    🛒 View & Buy on Amazon →
                  </a>

                  <button
                    type="button"
                    className="details-compare-btn"
                    onClick={() => {
                      toggleCompare(selectedLaptop);
                      setSelectedLaptop(null);
                    }}
                  >
                    {compareList.some((item) => item.id === selectedLaptop.id)
                      ? "✓ Added to Compare"
                      : "⚖️ Add to Comparison"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="studio-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">💻 LaptopFinder AI</span>
            <p className="footer-tagline">
              Precision hardware discovery powered by intelligent bottleneck analysis.
            </p>
          </div>
          <div className="footer-nav">
            <a href="#copilot">Copilot Search</a>
            <a href="#personas">Personas</a>
            <a href="#studio">Studio Filters</a>
            <a href="#results">Catalogue</a>
          </div>
        </div>
        <div className="footer-bottom">
          <small>© 2026 LaptopFinder AI. Engineered for modern high-performance buyers.</small>
        </div>
      </footer>
    </div>
  );
}

export default App;