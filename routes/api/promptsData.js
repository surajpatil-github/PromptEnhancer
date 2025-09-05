const express = require("express");
const router = express.Router();

// Import template and insert data
const templates = require("../../data/templates");
const inserts = require("../../data/inserts");

// @route   GET api/prompts/templates
// @desc    Get all prompt templates
// @access  Public
router.get("/templates", (req, res) => {
  res.json(templates);
});

// @route   GET api/prompts/inserts
// @desc    Get all insert phrases
// @access  Public
router.get("/inserts", (req, res) => {
  res.json(inserts);
});

// Get all available prompt engineering techniques
router.get("/", (req, res) => {
  const techniques = {
    basic: [
      {
        id: "clarity",
        name: "Clarity Enhancement",
        description: "Make the prompt more specific and remove ambiguity",
      },
      {
        id: "context",
        name: "Context Addition",
        description:
          "Add relevant context to make the prompt more comprehensive",
      },
      {
        id: "constraints",
        name: "Constraints",
        description: "Add specific constraints and requirements",
      },
      {
        id: "examples",
        name: "Examples",
        description: "Add relevant examples to illustrate expected output",
      },
    ],
    advanced: [
      {
        id: "chain_of_thought",
        name: "Chain of Thought",
        description: "Encourage step-by-step reasoning",
      },
      {
        id: "few_shot",
        name: "Few-Shot Learning",
        description: "Add input-output examples to guide the response",
      },
      {
        id: "role_play",
        name: "Role Play",
        description: "Frame as a conversation with a specific expert role",
      },
    ],
  };

  res.json(techniques);
});

module.exports = router;

// --- Enhance prompt (POST) ---
// Will be reachable as:
//  - POST /api/prompts           (because we mount this router at /api/prompts)
//  - POST /api/enhance           (we'll add an alias in server.js)
// Body example:
// {
//   "text": "bake a cake",
//   "tone": "Simple",             // optional
//   "format": "Bullet points",    // optional
//   "content": "Add constraints", // optional
//   "language": "English",        // optional
//   "model": "gpt-4o"             // optional
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

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const system = `You are a prompt-engineering assistant.
Rewrite and enhance the user's prompt according to the provided preferences.
Keep it concise, unambiguous, and directly usable with LLMs. Output only the improved prompt (${language}).`;

    const userMessage =
      `Original prompt:\n${text}\n\n` +
      `Tone: ${tone}\nFormat: ${format}\nAdditional guidance: ${content || "none"}\n` +
      `Return only the enhanced prompt.`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    });

    const enhanced =
      completion.choices?.[0]?.message?.content?.trim() || "";

    return res.json({
      ok: true,
      enhanced,
      model,
      usage: completion.usage || null
    });
  } catch (err) {
    console.error("Enhance error:", err);
    return res
      .status(500)
      .json({ error: "Failed to enhance prompt via OpenAI." });
  }
});
