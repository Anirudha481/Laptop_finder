# 💻 LaptopFinder AI (SpecWise)

An intelligent, full-stack laptop discovery and hardware recommendation platform. LaptopFinder AI bridges the gap between complex hardware specifications and real-world workflows, leveraging high-speed **Groq Cloud AI (`qwen/qwen3.8-27b`)** to evaluate bottlenecks, match user workloads, parse natural language queries, and route buyers directly to store listings.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://laptop-finder-nu.vercel.app/)
[![Backend API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://laptop-finder-api-jw07.onrender.com/api/laptops)
[![AI Engine](https://img.shields.io/badge/AI-Groq%20%7C%20Qwen%203.8--27B-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://console.groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Highlights & Key Features

- **⚡ Groq-Powered Hardware Advisory:** Evaluates user-specified workflows (Coding, Gaming, 3D Editing, Office Productivity, Student tasks) against hardware profiles using the blazing-fast `qwen/qwen3.8-27b` model on Groq LPU inference.
- **💬 Natural Language Query Parsing:** Users can describe what they need in plain English (e.g., *"Gaming laptop under 80k with 16GB RAM and RTX graphics"*), and AI parses it into precise hardware filter parameters.
- **🎯 Dynamic Cascading Specification Filters:** Responsive input controls that adapt based on the selected operating system (Windows vs. macOS) to ensure only valid processor lines, generational tiers, and GPU series are queried.
- **⚡ Preset Quick-Start Chips:** Instant 1-click presets for popular personas like *B.Tech CS Student*, *AAA Gaming under ₹80k*, and *Developer MacBook*.
- **📊 Side-by-Side Comparison Matrix:** Compare up to 3 candidate machines across critical metrics including price, CPU generation, dedicated GPU model, RAM capacity, and storage.
- **🛡️ Smart Fallback Heuristic Engine:** Gracefully falls back to client-side heuristics if the backend is cold-starting or rate-limited, maintaining zero-downtime search capability.
- **🛒 One-Click Store Routing:** Generates targeted, search-optimized Amazon product links for every recommended configuration.
- **🌓 Adaptive Dark / Light UI:** Built with persistent theme states stored in local browser cache.

---

## 🏗️ System Architecture

```
                 +---------------------------------------+
                 |            Client Browser             |
                 |      (React 18 SPA on Vercel CDN)     |
                 +---------------------------------------+
                                     |
               GET /api/laptops      |  POST /api/ai/recommend
               POST /api/ai/parse    |  (User Form Specs)
                                     v
                 +---------------------------------------+
                 |            Express Backend            |
                 |          (Node.js on Render)          |
                 +---------------------------------------+
                        |                         |
       Loads in-memory  |                         | Sends budget-filtered
       hardware dataset |                         | candidates & prompt
                        v                         v
               +-----------------+       +-----------------+
               | In-Memory Cache |       |    Groq Cloud   |
               | (Static Models) |       |  LPU Inference  |
               +-----------------+       | (qwen3.8-27b)   |
                                         +-----------------+
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Modular CSS3 with Custom Design Tokens & Dark/Light Mode variables
- **Hosting:** Vercel Global Edge Network

### Backend
- **Runtime:** Node.js (v18+)
- **Web Framework:** Express.js
- **AI Engine:** Groq SDK (`groq-sdk`) with `qwen/qwen3.8-27b` model
- **CORS Management:** Configured cross-origin resource sharing middleware
- **Hosting:** Render Web Services

---

## 📁 Repository Structure

```
Laptop_finder/
├── backend/
│   ├── data/
│   │   └── laptops.js          # In-memory laptop hardware dataset
│   ├── package.json            # Backend scripts and dependencies
│   ├── server.js               # Express application entry & Groq AI routes
│   └── .env                    # Local environment variables (git-ignored)
├── docker-react-demo/          # Frontend React client directory
│   ├── public/
│   ├── src/
│   │   ├── App.css             # Responsive styling, tables, modals & tokens
│   │   ├── App.jsx             # React component hierarchy & UI logic
│   │   ├── index.css
│   │   └── main.jsx            # Application mount point
│   ├── index.html
│   ├── package.json            # Frontend scripts and dependencies
│   ├── vite.config.js          # Vite build configuration
│   └── .env                    # Local environment variables (git-ignored)
├── .gitignore                  # Git tracking exclusion list
└── README.md                   # Project documentation
```

---

## 🚀 Local Development Setup

Follow these steps to run both backend and frontend locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or newer)
- [Git](https://git-scm.com/)
- A free **Groq API Key** from [Groq Console](https://console.groq.com/keys)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Anirudha481/Laptop_finder.git
cd Laptop_finder
```

### 2. Configure & Run Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
GROQ_API_KEY=gsk_your_groq_api_key_here
```

Start the backend server:
```bash
npm start
```
The backend will launch at `http://localhost:5000`.

### 3. Configure & Run Frontend
In a new terminal window:
```bash
cd docker-react-demo
npm install
```

*(Optional for local testing)* Create a `.env` file inside `docker-react-demo/`:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📡 API Reference

### 1. Fetch Complete Laptop Catalog
- **Endpoint:** `GET /api/laptops`
- **Description:** Returns the complete list of laptops stored in the dataset.
- **Response Format:**
```json
[
  {
    "id": 1,
    "brand": "HP",
    "model": "15s Intel i3 12th Gen",
    "price": 36990,
    "image": "https://images.unsplash.com/...",
    "os": "Windows",
    "processorBrand": "Intel",
    "processor": "Core i3",
    "generation": "12th Gen",
    "gpuBrand": "Intel",
    "gpuSeries": "Arc Series",
    "gpu": "Intel Arc Graphics",
    "ram": "8 GB",
    "storage": "512 GB SSD",
    "display": "15.6 inch",
    "usage": ["Student", "Business"]
  }
]
```

### 2. Parse Natural Language Prompt with AI
- **Endpoint:** `POST /api/ai/parse-prompt`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "promptText": "Looking for a coding laptop with 16GB RAM and 512GB SSD under 70k"
}
```
- **Response Format:**
```json
{
  "success": true,
  "filters": {
    "usage": "Coding",
    "operatingSystem": "Windows",
    "ram": "16 GB",
    "storage": "512 GB SSD",
    "maxBudget": 70000
  }
}
```

### 3. Request AI Recommendations
- **Endpoint:** `POST /api/ai/recommend`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "usage": "Gaming",
  "operatingSystem": "Windows",
  "processorBrand": "Intel",
  "processorSeries": "Core i7",
  "gpuBrand": "NVIDIA",
  "gpuSeries": "RTX 40 Series",
  "ram": "16 GB",
  "storage": "512 GB SSD",
  "maxBudget": 90000
}
```
- **Response Format:**
```json
{
  "success": true,
  "laptops": [
    {
      "id": 12,
      "brand": "Lenovo",
      "model": "LOQ 15 i7 13th Gen",
      "price": 79990,
      "matchScore": 96,
      "aiVerdict": "Exceptional pairing of the 13th Gen i7 with the RTX 4060 provides optimal thermal headroom and 1080p ultra performance.",
      "processor": "Core i7",
      "gpu": "RTX 4060",
      "ram": "16 GB",
      "storage": "512 GB SSD",
      "display": "15.6 inch"
    }
  ]
}
```

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Import the repository in [Vercel](https://vercel.com).
2. Set the **Root Directory** to `docker-react-demo`.
3. Add the following **Environment Variable**:
   - `VITE_API_URL`: `https://laptop-finder-api-jw07.onrender.com` (your deployed backend URL)
4. Deploy!

### Backend (Render)
1. Create a **Web Service** on [Render](https://render.com) pointing to the `backend` directory.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add the following **Environment Variable**:
   - `GROQ_API_KEY`: `gsk_your_groq_api_key_here`
5. Deploy!

> **Note on Render Free Tier:** Render spins down inactive backend containers after 15 minutes of inactivity. When accessed after a sleep period, the initial request may take ~20-30 seconds to wake up. The frontend includes a fallback scoring engine to ensure smooth usability.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
