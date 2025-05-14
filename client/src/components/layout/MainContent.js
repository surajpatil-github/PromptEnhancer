import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";

const MainContent = ({
  originalPrompt,
  setOriginalPrompt,
  enhancedPrompt,
  loading,
  error,
  models,
  selectedModel,
  setSelectedModel,
  selectedSkills,
  handleSkillToggle,
  toggleAllSkills,
  selectedPhrases,
  handlePhraseToggle,
  useEnglish,
  setUseEnglish,
  useSimplified,
  setUseSimplified,
  enhancePrompt,
}) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Select Prompt Engineering Skills
          </Typography>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={Object.values(selectedSkills).every(
                    (value) => value
                  )}
                  onChange={(e) => toggleAllSkills(e.target.checked)}
                />
              }
              label="Select/Unselect All Skills"
            />
          </Box>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Basic Techniques
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedSkills.clarity}
                      onChange={() => handleSkillToggle("clarity")}
                    />
                  }
                  label="Clarity Enhancement"
                />
                <Typography variant="body2" color="text.secondary">
                  Make the prompt more specific and remove ambiguity.
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedSkills.context}
                      onChange={() => handleSkillToggle("context")}
                    />
                  }
                  label="Context Addition"
                />
                <Typography variant="body2" color="text.secondary">
                  Add relevant context to make the prompt more comprehensive.
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedSkills.constraints}
                      onChange={() => handleSkillToggle("constraints")}
                    />
                  }
                  label="Constraints"
                />
                <Typography variant="body2" color="text.secondary">
                  Add specific constraints and requirements.
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedSkills.examples}
                      onChange={() => handleSkillToggle("examples")}
                    />
                  }
                  label="Examples"
                />
                <Typography variant="body2" color="text.secondary">
                  Add relevant examples to illustrate expected output.
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                Advanced Techniques
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedSkills.chain_of_thought}
                      onChange={() => handleSkillToggle("chain_of_thought")}
                    />
                  }
                  label="Chain of Thought"
                />
                <Typography variant="body2" color="text.secondary">
                  Encourage step-by-step reasoning.
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedSkills.few_shot}
                      onChange={() => handleSkillToggle("few_shot")}
                    />
                  }
                  label="Few-Shot Learning"
                />
                <Typography variant="body2" color="text.secondary">
                  Add input-output examples to guide the response.
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedSkills.role_play}
                      onChange={() => handleSkillToggle("role_play")}
                    />
                  }
                  label="Role Play"
                />
                <Typography variant="body2" color="text.secondary">
                  Frame as a conversation with a specific expert role.
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Enhance Your Prompt
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder="Enter your prompt here to receive an enhanced version."
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Additional Style Options
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_specific}
                  onChange={() => handlePhraseToggle("be_specific")}
                />
              }
              label="Be Specific"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_concise}
                  onChange={() => handlePhraseToggle("be_concise")}
                />
              }
              label="Be Concise"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_creative}
                  onChange={() => handlePhraseToggle("be_creative")}
                />
              }
              label="Be Creative"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_technical}
                  onChange={() => handlePhraseToggle("be_technical")}
                />
              }
              label="Be Technical"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_simple}
                  onChange={() => handlePhraseToggle("be_simple")}
                />
              }
              label="Be Simple"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_professional}
                  onChange={() => handlePhraseToggle("be_professional")}
                />
              }
              label="Be Professional"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_friendly}
                  onChange={() => handlePhraseToggle("be_friendly")}
                />
              }
              label="Be Friendly"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_formal}
                  onChange={() => handlePhraseToggle("be_formal")}
                />
              }
              label="Be Formal"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_casual}
                  onChange={() => handlePhraseToggle("be_casual")}
                />
              }
              label="Be Casual"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={selectedPhrases.be_structured}
                  onChange={() => handlePhraseToggle("be_structured")}
                />
              }
              label="Be Structured"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                label="Model"
              >
                {models.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={useEnglish}
                  onChange={(e) => setUseEnglish(e.target.checked)}
                />
              }
              label="Force English"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={useSimplified}
                  onChange={(e) => setUseSimplified(e.target.checked)}
                />
              }
              label="Simplified Mode"
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={enhancePrompt}
            disabled={loading}
            fullWidth
            sx={{ mb: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : "Enhance Prompt"}
          </Button>

          {enhancedPrompt && (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Enhanced Prompt</Typography>
                  <IconButton onClick={() => copyToClipboard(enhancedPrompt)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {enhancedPrompt}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MainContent;
