require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI, Type } = require("@google/genai");
const cors = require("cors");
app.use(cors());

const laptops = require("./data/laptops");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "LaptopFinder backend is running 🚀" });
});

app.get("/api/laptops", (req, res) => {
  res.json(laptops);
});

/* =========================================================
   LOCAL FALLBACK ENGINE (Triggers on 503 or Network Failure)
========================================================= */
function generateLocalRecommendations(userRequirements) {
  const scored = laptops.map((laptop) => {
    let score = 0;
    let totalWeight = 0;

    const check = (selected, actual, weight) => {
      if (!selected) return;
      totalWeight += weight;
      if (selected.toLowerCase() === actual.toLowerCase()) {
        score += weight;
      }
    };

    check(userRequirements.operatingSystem, laptop.os, 3);
    check(userRequirements.processorBrand, laptop.processorBrand, 3);
    check(userRequirements.processorSeries, laptop.processor, 4);
    check(userRequirements.processorGeneration, laptop.generation, 3);
    check(userRequirements.gpuBrand, laptop.gpuBrand, 3);
    check(userRequirements.gpuSeries, laptop.gpuSeries, 4);
    check(userRequirements.gpuModel, laptop.gpu, 5);
    check(userRequirements.ram, laptop.ram, 2);
    check(userRequirements.storage, laptop.storage, 2);
    check(userRequirements.display, laptop.display, 2);

    if (userRequirements.usage) {
      totalWeight += 3;
      if (Array.isArray(laptop.usage) && laptop.usage.includes(userRequirements.usage)) {
        score += 3;
      }
    }

    if (userRequirements.budget) {
      totalWeight += 3;
      const price = Number(laptop.price) || 0;
      let budgetMatch = false;
      switch (userRequirements.budget) {
        case "Under ₹40,000": budgetMatch = price < 40000; break;
        case "₹40,000 – ₹60,000": budgetMatch = price >= 40000 && price <= 60000; break;
        case "₹60,000 – ₹80,000": budgetMatch = price > 60000 && price <= 80000; break;
        case "₹80,000 – ₹1,00,000": budgetMatch = price > 80000 && price <= 100000; break;
        case "Above ₹1,00,000": budgetMatch = price > 100000; break;
        default: budgetMatch = true;
      }
      if (budgetMatch) score += 3;
    }

    const matchScore = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 90;

    const aiVerdict = `Powered by ${laptop.processor} (${laptop.generation}) with ${laptop.gpu}, providing balanced throughput and solid thermals for ${
      userRequirements.usage || "general productivity and gaming"
    }.`;

    return {
      ...laptop,
      matchScore: Math.min(matchScore, 100),
      aiVerdict,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
}

/* =========================================================
   AI RECOMMENDATION ENDPOINT
========================================================= */
app.post("/api/ai/recommend", async (req, res) => {
  const userRequirements = req.body;

  // Lightweight summary for token and latency efficiency
  const catalogSummary = laptops.map((laptop) => ({
    id: laptop.id,
    brand: laptop.brand,
    model: laptop.model,
    price: laptop.price,
    os: laptop.os,
    processor: `${laptop.processorBrand} ${laptop.processor} (${laptop.generation})`,
    gpu: `${laptop.gpuBrand} ${laptop.gpu}`,
    ram: laptop.ram,
    storage: laptop.storage,
    display: laptop.display,
    usage: laptop.usage,
  }));

  const prompt = `
You are a senior hardware engineering consultant and laptop advisor.
Analyze the user's selected specs and intended usage against our catalogue.
Select the top 5 to 6 best-fitting laptops from the catalogue.
If an exact match does not exist, select the closest viable alternatives that avoid CPU/GPU bottlenecks.

User Requirements:
${JSON.stringify(userRequirements, null, 2)}

Available Laptop Catalogue:
${JSON.stringify(catalogSummary, null, 2)}
`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      recommendations: {
        type: Type.ARRAY,
        description: "Top 5 to 6 recommended laptop objects.",
        items: {
          type: Type.OBJECT,
          properties: {
            id: {
              type: Type.INTEGER,
              description: "The exact ID of the laptop from the catalogue.",
            },
            matchScore: {
              type: Type.INTEGER,
              description: "Relevance score between 1 and 100.",
            },
            aiVerdict: {
              type: Type.STRING,
              description: "1-2 concise sentences explaining why this laptop satisfies their needs.",
            },
          },
          required: ["id", "matchScore", "aiVerdict"],
        },
      },
    },
    required: ["recommendations"],
  };

  // List of models in order of preference (fallback on 503 high demand)
  const candidateModels = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-2.0-flash"];

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.2,
        },
      });

      const parsedData = JSON.parse(response.text);

      const recommendedLaptops = (parsedData.recommendations || [])
        .map((rec) => {
          const fullLaptop = laptops.find((item) => item.id === rec.id);
          if (!fullLaptop) return null;
          return {
            ...fullLaptop,
            matchScore: rec.matchScore,
            aiVerdict: rec.aiVerdict,
          };
        })
        .filter(Boolean);

      if (recommendedLaptops.length > 0) {
        return res.json({
          success: true,
          modelUsed: modelName,
          laptops: recommendedLaptops,
        });
      }
    } catch (err) {
      console.warn(`Model ${modelName} unavailable (${err.status || err.message}), attempting next model...`);
    }
  }

  // If cloud endpoints are temporarily saturated (503), serve local recommendations
  console.info("Using local scoring engine fallback due to cloud demand.");
  const localLaptops = generateLocalRecommendations(userRequirements);
  return res.json({
    success: true,
    fallbackUsed: true,
    laptops: localLaptops,
  });
});

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

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(`${systemInstruction}\nUser Prompt: "${promptText}"`);
    const responseText = response.response.text().trim().replace(/^```json/i, "").replace(/```$/i, "");

    const parsedParams = JSON.parse(responseText);
    res.json({ success: true, filters: parsedParams });
  } catch (error) {
    console.error("Error parsing prompt with AI:", error);
    res.status(500).json({ success: false, error: "Failed to process prompt with AI" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
