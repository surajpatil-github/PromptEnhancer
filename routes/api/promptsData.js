const express = require("express");
const router = express.Router();

// If your repo has these data files, keep them; otherwise you can remove these two lines
let templates = [];
let inserts = [];
try {
  templates = require("../../data/templates");
} catch {}
try {
  inserts = require("../../data/inserts");
} catch {}

// --------- GET endpoints (for your UI lists) ---------

// GET /api/prompts/templates
router.get("/templates", (_req, res) => res.json(templates));

// GET /api/prompts/inserts
router.get("/inserts", (_req, res) => res.json(inserts));

// GET /api/prompts  (techniques list used by UI)
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

// --------- POST enhance (the one your button needs) ---------

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --------- POST enhance ---------
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// helper: pick first non-empty string
const pick = (...vals) => vals.find(v => typeof v === "string" && v.trim().length) || "";

router.post("/", async (req, res) => {
  try {
    console.log("ENHANCE incoming headers:", req.headers);
    console.log("ENHANCE incoming body:", typeof req.body, req.body);

    const b = req.body || {};
    const text = pick(
      b.text,
      b.prompt,
      b.input,
      b.message,
      b.query,
      b.content,
      b?.data?.text,
      b?.data?.prompt,
      typeof b === "string" ? b : ""
    );

    const tone     = pick(b.tone, b.style, "Simple");
    const format   = pick(b.format, "Plain");
    const guidance = pick(b.guidance, b.extra, b.notes, "");
    const language = pick(b.language, "English");
    const model    = pick(b.model, "gpt-4o");

    if (!text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const system =
      `You are a prompt-engineering assistant. ` +
      `Rewrite and enhance the user's prompt using the provided preferences. ` +
      `Be clear, specific, and unambiguous. Output only the improved prompt in ${language}.`;

    const userMessage =
      `Original prompt:\n${text}\n\n` +
      `Preferences:\n- Tone: ${tone}\n- Format: ${format}\n- Extra guidance: ${guidance || "none"}`;

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
      result: enhanced,
      enhancedPrompt: enhanced,
      data: { enhanced },
      model,
      usage: completion.usage || null
    });
  } catch (err) {
    console.error("Enhance error:", err);
    return res.status(500).json({ error: "Failed to enhance prompt via OpenAI." });
  }
});


module.exports = router;


