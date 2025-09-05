const express = require("express");
const router = express.Router();

// Import templates and insert data
// (these files exist in your repo: /data/*.js and /templates.js)
const templates = require("../../data/templates");
const inserts = require("../../data/inserts");

// -------------- GET endpoints --------------

// @route  GET /api/prompts/templates
// @desc   Get all prompt templates
// @access Public
router.get("/templates", (_req, res) => {
  res.json(templates);
});

// @route  GET /api/prompts/inserts
// @desc   Get all insert phrases
// @access Public
router.get("/inserts", (_req, res) => {
  res.json(inserts);
});

// @route  GET /api/prompts
// @desc   Get all available prompt-engineering techniques (for UI list)
// @access Public
router.get("/", (_req, res) => {
  const techniques = {
    basic: [
      { id: "clarity", name: "Clarity Enhancement", description: "Make the prompt more specific and remove ambiguity." },
      { id: "context", name: "Context Addition", description: "Add relevant context to make the prompt more comprehensive." },
      { id: "constraints", name: "Constraints", description: "Add specific constraints and requirements." },
      { id: "examples", name: "Examples", description: "Add relevant examples to illustrate expected output." }
    ],
    advanced: [
      { id: "chain_of_thought", name: "Chain of Thought", description: "Encourage step-by-step reasoning." },
      { id: "few_shot", name: "Few-shot Learning", description: "Add input–output examples to guide the response." },
      { id: "role_play", name: "Role Play", description: "Frame as a conversation with a specific expert role." }
    ]
  };
  res.json(techniques);
});

// -------------- POST enhance --------------
// Works at BOTH:
//   POST /api/prompts          (because this file is mounted at /api/prompts)
//   POST /api/enhance          (server.js mounts the same router at /api/enhance)
//
// Body example:
// {
//   "text": "bake a cake",
//   "tone": "Simple",
//   "format": "Plain",
//   "content": "Add constraints",
//   "language": "English",
//   "model": "gpt-4o"
// }

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const {
      text,
      tone = "Simple",
      format = "Plain",
      content = "",
      language = "English",
      model = "gpt-4o"
    } = req.body || {};

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const system =
      `You are a prompt-engineering assistant. ` +
      `Rewrite and enhance the user's prompt using the provided preferences. ` +
      `Be clear, specific, and unambiguous. Output only the improved prompt in ${language}.`;

    const userMessage =
      `Original prompt:\n${text}\n\n` +
      `Preferences:\n- Tone: ${tone}\n- Format: ${format}\n- Extra guidance: ${content || "none"}`;

    // OpenAI (Node v4 client)
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    });

    const enhanced = completion.choices?.[0]?.message?.content?.trim() || "";

    return res.json({
      ok: true,
      enhanced,
      model,
      usage: completion.usage || null
    });
  } catch (err) {
    console.error("Enhance error:", err);
    return res.status(500).json({ error: "Failed to enhance prompt via OpenAI." });
  }
});

module.exports = router;
