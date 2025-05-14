import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Link,
  Box,
  IconButton,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ApiIcon from "@mui/icons-material/Api";
import GitHubIcon from "@mui/icons-material/GitHub";

const Header = ({ apiKey, onApiKeyChange }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey || "");

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setTempApiKey(apiKey);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveApiKey = () => {
    onApiKeyChange(tempApiKey);
    setOpenDialog(false);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
    >
      <Toolbar>
        <RocketLaunchIcon sx={{ mr: 1.5 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Prompt Enhancer
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link
            href="https://arxiv.org/pdf/2312.16171.pdf"
            target="_blank"
            rel="noopener"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <Button color="inherit" size="small">
              Documentation
            </Button>
          </Link>

          <IconButton
            color="inherit"
            component={Link}
            href="https://github.com/rohit/a"
            target="_blank"
            rel="noopener"
            size="small"
          >
            <GitHubIcon />
          </IconButton>

          <Button
            color="inherit"
            startIcon={<ApiIcon />}
            onClick={handleOpenDialog}
            variant="outlined"
            size="small"
          >
            {apiKey ? "API Key ✓" : "Set API Key"}
          </Button>
        </Box>
      </Toolbar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>OpenAI API Key</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="API Key"
              type="password"
              fullWidth
              variant="outlined"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Your API key is stored locally in your browser and is never sent
              to our servers. You can get your OpenAI API key{" "}
              <Link
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener"
              >
                here
              </Link>
              .
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveApiKey} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
