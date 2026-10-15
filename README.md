# 💻 LaptopFinder AI (SpecWise)

An intelligent, full-stack laptop discovery and hardware recommendation platform. LaptopFinder AI bridges the gap between technical hardware specifications and real-world workflows, leveraging Google Gemini generative AI to evaluate bottlenecks, score compatibility, and route users directly to store listings.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://laptop-finder-nu.vercel.app/)
[![Backend API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://laptop-finder-api-jw07.onrender.com/api/laptops)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Highlights & Key Features

- **Gemini-Powered Hardware Advisory:** Evaluates user-specified workloads (Coding, Gaming, 3D Editing, Office Productivity, Student tasks) against hardware profiles to output custom compatibility scores and bottleneck breakdowns.
- **Cascading Dynamic Specification Filters:** Responsive input controls that adapt based on the selected operating system (Windows vs. macOS) to ensure only valid processor lines, generational tiers, and GPU series are queried.
- **Side-by-Side Comparison Matrix:** Compare up to 3 candidate machines across critical metrics including price, CPU generation, dedicated GPU model, RAM capacity, and storage.
- **Smart Fallback Engine:** Gracefully falls back to client-side heuristics if the backend is cold-starting or offline, maintaining zero-downtime search capability.
- **One-Click Store Routing:** Generates targeted, search-optimized Amazon product links for every recommended configuration.
- **Adaptive Dark / Light UI:** Built with persistent theme states stored in local browser cache.

---

## 🏗️ System Architecture

```
                 +---------------------------------------+
                 |            Client Browser             |
                 |      (React 18 SPA on Vercel CDN)     |
                 +---------------------------------------+
                                     |
               GET /api/laptops      |  POST /api/ai/recommend
               (Initial Catalog)     |  (User Form Specs)
                                     v
                 +---------------------------------------+
                 |            Express Backend            |
                 |          (Node.js on Render)          |
                 +---------------------------------------+
                        |                         |
       Loads in-memory  |                         | Sends filtered candidates
       hardware dataset |                         | & prompt for ranking
                        v                         v
               +-----------------+       +-----------------+
               | In-Memory Cache |       |  Google Gemini  |
               | (Static Models) |       |   Generative    |
               +-----------------+       |     AI API      |
                                         +-----------------+
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Bundler:** Vite
- **Styling:** Modular CSS3 with Custom Properties & Dark Mode variables
- **Hosting:** Vercel Global Edge Network

### Backend
- **Runtime:** Node.js (v18+)
- **Web Server:** Express.js
- **AI Integration:** `@google/genai` (Google Gemini API)
- **CORS Management:** Fully configured cross-origin middleware
- **Hosting:** Render Web Services

---

## 📁 Repository Structure

```
Laptop_finder/
├── backend/
│   ├── data/
│   │   └── laptops.js          # In-memory laptop hardware dataset
│   ├── .env.example            # Environment variable template
│   ├── package.json            # Backend scripts and dependencies
│   └── server.js               # Express application entry & Gemini routes
├── docker-react-demo/          # Frontend React client directory
│   ├── public/
│   ├── src/
│   │   ├── App.css             # Main styling, responsive tables & modals
│   │   ├── App.jsx             # React component hierarchy & UI logic
│   │   ├── index.css
│   │   └── main.jsx            # Application mount point
│   ├── index.html
│   ├── package.json            # Frontend scripts and dependencies
│   └── vite.config.js          # Vite build parameters
├── .gitignore                  # Git tracking exclusion list
└── README.md                   # Project documentation
```

---

## 🚀 Local Development Setup

Follow these steps to run both backend and frontend locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or newer)
- [Git](https://git-scm.com/)
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Anirudha481/Laptop_finder.git
cd Laptop_finder
```

### 2. Configure the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend development server:
```bash
node server.js
```
The backend will launch at `http://localhost:5000`.

### 3. Configure the Frontend
Open a new terminal window:
```bash
cd Laptop_finder/docker-react-demo
npm install
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
- **Description:** Returns the full array of hardware profiles stored in the backend catalogue.
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

### 2. Request AI Recommendations
- **Endpoint:** `POST /api/ai/recommend`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "usage": "Gaming",
  "operatingSystem": "Windows",
  "processorBrand": "Intel",
  "processorSeries": "Core i7",
  "processorGeneration": "13th Gen",
  "gpuBrand": "NVIDIA",
  "gpuSeries": "RTX 40 Series",
  "gpuModel": "RTX 4060",
  "ram": "16 GB",
  "storage": "512 GB SSD",
  "display": "15.6 inch",
  "budget": "₹80,000 – ₹1,00,000"
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

## 🌐 Production Deployments

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend** | Vercel | [https://laptop-finder-nu.vercel.app/](https://laptop-finder-nu.vercel.app/) |
| **Backend API** | Render | [https://laptop-finder-api-jw07.onrender.com](https://laptop-finder-api-jw07.onrender.com) |

> **Note on Render Free Tier:** Render spins down inactive containers after 15 minutes of inactivity. When accessed after a sleep period, the initial request may take ~20-30 seconds to wake up.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
