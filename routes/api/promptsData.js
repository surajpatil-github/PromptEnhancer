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
