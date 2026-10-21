require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const laptopsData = require("./data/laptops");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Slim catalogue — only fields the AI needs for ranking
const slimCatalogue = laptopsData.map(({ id, brand, model, price, os, processor, processorBrand, generation, gpu, gpuBrand, gpuSeries, ram, storage, display, usage }) => ({
  id, brand, model, price, os, processor, processorBrand, generation, gpu, gpuBrand, gpuSeries, ram, storage, display, usage,
}));

// Helper: strip markdown code fences and extract first JSON value
function extractJSON(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!match) throw new Error("No JSON found in model response");
  return JSON.parse(match[1]);
}

/* =========================================================
   ROUTES
========================================================= */

// GET /api/laptops
app.get("/api/laptops", (req, res) => {
  res.json(laptopsData);
});

// POST /api/ai/parse-prompt
app.post("/api/ai/parse-prompt", async (req, res) => {
  try {
    const { promptText } = req.body;
    if (!promptText || typeof promptText !== "string") {
      return res.status(400).json({ success: false, error: "Invalid prompt text provided" });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, error: "API key configuration missing on server" });
    }

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        {
          role: "system",
          content: `You are a hardware search parameter extractor.
Return ONLY a raw JSON object (no markdown) with these exact keys:
{"usage":"","operatingSystem":"","ram":"","storage":"","maxBudget":150000}
Allowed usage values: Student, Coding, Gaming, Editing, Design, Business, or empty string.
Allowed operatingSystem: Windows, macOS, or empty string.
Allowed ram: 8 GB, 16 GB, 24 GB, 32 GB, 64 GB, or empty string.
Allowed storage: 256 GB SSD, 512 GB SSD, 1 TB SSD, 2 TB SSD, or empty string.
maxBudget is an integer (75k=75000, 1.2 lakh=120000, default 150000).`,
        },
        { role: "user", content: promptText },
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    const rawText = completion.choices[0]?.message?.content || "{}";
    const parsedParams = extractJSON(rawText);
    res.json({ success: true, filters: parsedParams });
  } catch (error) {
    console.error("PARSE PROMPT ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message || "Failed to process prompt with AI" });
  }
});

// POST /api/ai/recommend
app.post("/api/ai/recommend", async (req, res) => {
  try {
    const userSpecs = req.body;
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, error: "API key configuration missing on server" });
    }

    // Pre-filter by budget before sending to AI
    const budgetCap = Number(userSpecs.maxBudget) || 150000;
    const filteredCatalogue = slimCatalogue.filter((l) => l.price <= budgetCap);

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        {
          role: "system",
          content: `You are a PC hardware advisor. Rank the top laptops (up to 6) from the catalogue.
Return ONLY a raw JSON array (no markdown, no extra text):
[{"id":1,"matchScore":95,"aiVerdict":"One sentence reason"}]`,
        },
        {
          role: "user",
          content: `Catalogue: ${JSON.stringify(filteredCatalogue)}\nUser requirements: ${JSON.stringify(userSpecs)}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 700,
    });

    const rawText = completion.choices[0]?.message?.content || "[]";
    let parsed = extractJSON(rawText);

    // Unwrap if model wrapped array in an object key
    const aiRankings = Array.isArray(parsed)
      ? parsed
      : parsed.laptops || parsed.recommendations || Object.values(parsed)[0] || [];

    const recommendedLaptops = aiRankings
      .map((rank) => {
        const match = laptopsData.find((l) => l.id === rank.id);
        if (!match) return null;
        return { ...match, matchScore: rank.matchScore, aiVerdict: rank.aiVerdict };
      })
      .filter(Boolean);

    res.json({ success: true, laptops: recommendedLaptops });
  } catch (error) {
    console.error("RECOMMEND ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message || "AI recommendation error" });
  }
});

/* =========================================================
   START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});