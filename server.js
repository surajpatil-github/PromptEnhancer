require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
    credentials: true,
  })
);

// Import routes
let promptsData;
try {
  promptsData = require("./routes/api/promptsData");
} catch (error) {
  console.error("Error loading promptsData route:", error);
  promptsData = express.Router();
}

// API Routes
app.use("/api/prompts", promptsData);

// OpenAI API route
app.post("/api/enhance", async (req, res) => {
  try {
    const {
      apiKey,
      prompt,
      skills,
      model,
      insertPhrases,
      useEnglish,
      useSimplified,
    } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "API key is required" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Create OpenAI instance with the user's API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    let enhancedPrompt = prompt;

    // Process the prompt based on the selected skills and options
    if (useSimplified) {
      // Apply all skills at once for simplified mode
      enhancedPrompt = await applySkills(
        openai,
        skills,
        prompt,
        useEnglish,
        model
      );

      // Add insert phrases if selected
      if (insertPhrases && Object.keys(insertPhrases).length > 0) {
        const phrases = require("./data/inserts");
        Object.keys(insertPhrases).forEach((phrase) => {
          if (insertPhrases[phrase]) {
            enhancedPrompt = phrases[phrase] + "\n" + enhancedPrompt;
          }
        });
      }
    } else {
      // Apply skills one by one
      const results = [];
      let orderNum = 1;

      for (const skill in skills) {
        if (skills[skill]) {
          enhancedPrompt = await applySkill(
            openai,
            skill,
            enhancedPrompt,
            orderNum,
            useEnglish,
            model
          );
          results.push({
            step: orderNum,
            skill,
            prompt: enhancedPrompt,
          });
          orderNum++;
        }
      }

      // Add insert phrases if selected
      if (insertPhrases && Object.keys(insertPhrases).length > 0) {
        const phrases = require("./data/inserts");
        Object.keys(insertPhrases).forEach((phrase) => {
          if (insertPhrases[phrase]) {
            enhancedPrompt = phrases[phrase] + "\n" + enhancedPrompt;
            results.push({
              step: orderNum,
              skill: phrase,
              prompt: enhancedPrompt,
            });
            orderNum++;
          }
        });
      }

      return res.json({
        enhancedPrompt,
        steps: results,
      });
    }

    return res.json({ enhancedPrompt });
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// Helper function to apply a single skill
async function applySkill(openai, skill, prompt, orderNum, langEng, model) {
  let templates;
  try {
    templates = require("./data/templates");
  } catch (error) {
    console.error("Error loading templates:", error);
    throw new Error("Failed to load prompt templates");
  }

  let systemMessage = templates.system;
  if (langEng && orderNum === 1) {
    systemMessage += "\n" + templates.lang_eng;
  } else if (!langEng) {
    systemMessage += "\n" + templates.lang_default;
  }

  const template = templates[skill];
  if (!template) {
    throw new Error(`Template not found for skill: ${skill}`);
  }

  const formattedInput = template.replace("{prompt}", prompt);

  const response = await openai.chat.completions.create({
    model: model || "gpt-4",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: formattedInput },
    ],
  });

  return response.choices[0].message.content;
}

// Helper function to apply multiple skills at once
async function applySkills(openai, skills, prompt, langEng, model) {
  let templates;
  try {
    templates = require("./data/templates");
  } catch (error) {
    console.error("Error loading templates:", error);
    throw new Error("Failed to load prompt templates");
  }

  let systemMessage = templates.system_multiple;
  if (langEng) {
    systemMessage += "\n" + templates.lang_eng;
  } else {
    systemMessage += "\n" + templates.lang_default;
  }

  const selectedSkills = Object.keys(skills).filter((skill) => skills[skill]);
  let integratedTemplates = "[Prompt Engineering Techniques to Apply]\n";

  selectedSkills.forEach((skill, idx) => {
    const simplerKey = `${skill}_simpler`;
    const template = templates[simplerKey] || templates[skill];
    if (!template) {
      throw new Error(`Template not found for skill: ${skill}`);
    }
    integratedTemplates += `${idx + 1}. ${skill}: ${template}\n`;
  });

  integratedTemplates +=
    "Based on [Prompt engineering techniques to apply], refine the prompt provided below. Ensure that each technique is fully incorporated to achieve a clear and effective improvement:\n\n[original]\n" +
    prompt +
    "\n[improved]\n";

  const response = await openai.chat.completions.create({
    model: model || "gpt-4",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: integratedTemplates },
    ],
  });

  return response.choices[0].message.content;
}

// Add a default route for development
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send(
      "API is running. Please start the React app separately with: npm run client"
    );
  });
}

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
