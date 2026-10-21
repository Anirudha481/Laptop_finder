const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
const laptopsData = require("./data/laptops");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API client using @google/genai
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/* =========================================================
   ROUTES
========================================================= */

// GET /api/laptops - Return complete laptop catalogue
app.get("/api/laptops", (req, res) => {
  res.json(laptopsData);
});

// POST /api/ai/parse-prompt - Parse unstructured user prompts into filter JSON
app.post("/api/ai/parse-prompt", async (req, res) => {
  try {
    const { promptText } = req.body;
    if (!promptText || typeof promptText !== "string") {
      return res.status(400).json({ success: false, error: "Invalid prompt text provided" });
    }

    const systemInstruction = `You are a hardware search parameter extractor. 
    Analyze the user's natural language request for a laptop and return ONLY a single JSON object matching these exact keys:
    {
      "usage": "Student" | "Coding" | "Gaming" | "Editing" | "Design" | "Business" | "",
      "operatingSystem": "Windows" | "macOS" | "",
      "ram": "8 GB" | "16 GB" | "24 GB" | "32 GB" | "64 GB" | "",
      "storage": "256 GB SSD" | "512 GB SSD" | "1 TB SSD" | "2 TB SSD" | "",
      "maxBudget": number | 150000
    }
    Extract budget values (e.g. 75k = 75000, 1.2 lakh = 120000). Return raw valid JSON only without markdown codeblocks.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemInstruction}\nUser Prompt: "${promptText}"`,
    });

    const responseText = response.text.trim().replace(/^```json/i, "").replace(/```$/i, "");
    const parsedParams = JSON.parse(responseText);

    res.json({ success: true, filters: parsedParams });
  } catch (error) {
    console.error("Error parsing prompt with AI:", error);
    res.status(500).json({ success: false, error: "Failed to process prompt with AI" });
  }
});

// POST /api/ai/recommend - AI recommendation endpoint
app.post("/api/ai/recommend", async (req, res) => {
  try {
    const userSpecs = req.body;

    const systemInstruction = `You are an expert PC hardware advisor. Analyze the requested specs against the laptop catalogue provided below.
    Rank the top laptops (up to 6) based on compatibility with the user's usage and requirements.
    Return a valid JSON array where each object has:
    - id: (matching catalogue id)
    - matchScore: (integer 0-100)
    - aiVerdict: (1 short sentence explaining why this laptop fits)
    Return raw JSON array only without markdown formatting or codeblocks.`;

    const prompt = `${systemInstruction}\nCatalogue: ${JSON.stringify(laptopsData)}\nUser Specs: ${JSON.stringify(userSpecs)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text.trim().replace(/^```json/i, "").replace(/```$/i, "");
    const aiRankings = JSON.parse(responseText);

    const recommendedLaptops = aiRankings
      .map((rank) => {
        const match = laptopsData.find((l) => l.id === rank.id);
        if (!match) return null;
        return {
          ...match,
          matchScore: rank.matchScore,
          aiVerdict: rank.aiVerdict,
        };
      })
      .filter(Boolean);

    res.json({ success: true, laptops: recommendedLaptops });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ success: false, error: "AI recommendation error" });
  }
});

/* =========================================================
   START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});