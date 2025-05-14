import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MainContent from "./components/layout/MainContent";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#ff9800",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("openai_api_key") || process.env.REACT_APP_OPENAI_API_KEY
  );
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [models] = useState([
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-4-turbo-preview", name: "GPT-4 Turbo" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  ]);
  const [selectedModel, setSelectedModel] = useState("gpt-4");

  const [selectedSkills, setSelectedSkills] = useState({
    clarity: false,
    context: false,
    constraints: false,
    examples: false,
    chain_of_thought: false,
    few_shot: false,
    role_play: false,
  });

  const [selectedPhrases, setSelectedPhrases] = useState({
    be_specific: false,
    be_concise: false,
    be_creative: false,
    be_technical: false,
    be_simple: false,
    be_professional: false,
    be_friendly: false,
    be_formal: false,
    be_casual: false,
    be_structured: false,
  });

  const [useEnglish, setUseEnglish] = useState(false);
  const [useSimplified, setUseSimplified] = useState(true);

  // Handle API key change
  const handleApiKeyChange = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem("openai_api_key", newKey);
  };

  // Handle skill toggle
  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [skill]: !prev[skill],
    }));
  };

  // Toggle all skills
  const toggleAllSkills = (checked) => {
    const updatedSkills = {};
    Object.keys(selectedSkills).forEach((skill) => {
      updatedSkills[skill] = checked;
    });
    setSelectedSkills(updatedSkills);
  };

  // Handle phrase toggle
  const handlePhraseToggle = (phrase) => {
    setSelectedPhrases((prev) => ({
      ...prev,
      [phrase]: !prev[phrase],
    }));
  };

  // Enhance the prompt
  const enhancePrompt = async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key first");
      return;
    }

    if (!originalPrompt) {
      setError("Please enter a prompt to enhance");
      return;
    }

    // Check if any skill is selected
    if (!Object.values(selectedSkills).some((value) => value)) {
      setError("Please select at least one prompt engineering skill");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/enhance", {
        apiKey,
        prompt: originalPrompt,
        skills: selectedSkills,
        model: selectedModel,
        insertPhrases: selectedPhrases,
        useEnglish,
        useSimplified,
      });

      setEnhancedPrompt(response.data.enhancedPrompt);
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      setError(error.response?.data?.error || error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
          <MainContent
            originalPrompt={originalPrompt}
            setOriginalPrompt={setOriginalPrompt}
            enhancedPrompt={enhancedPrompt}
            loading={loading}
            error={error}
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            selectedSkills={selectedSkills}
            handleSkillToggle={handleSkillToggle}
            toggleAllSkills={toggleAllSkills}
            selectedPhrases={selectedPhrases}
            handlePhraseToggle={handlePhraseToggle}
            useEnglish={useEnglish}
            setUseEnglish={setUseEnglish}
            useSimplified={useSimplified}
            setUseSimplified={setUseSimplified}
            enhancePrompt={enhancePrompt}
          />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
