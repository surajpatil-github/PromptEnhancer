import React from "react";
import { 
  Box, 
  Typography, 
  Link, 
  Container, 
  Divider, 
  Stack, 
  IconButton,
  Chip
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: "auto",
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
            <Box
              sx={{
                mr: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <AutoFixHighIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #111827 0%, #4B5563 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Prompt Enhancer
              </Typography>
            </Box>
          </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1, sm: 2 }}
            alignItems="center"
            sx={{ mb: { xs: 2, md: 0 } }}
          >
            <Link 
              href="#" 
              underline="hover" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Documentation
            </Link>
            <Link 
              href="#" 
              underline="hover" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="https://github.com/Rohitlyengar/PromptEnhancer" 
              underline="hover" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              GitHub
            </Link>
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              size="small"
              label={`© ${new Date().getFullYear()} Prompt Enhancer`}
              sx={{ 
                fontWeight: 500, 
                color: 'text.secondary',
                borderRadius: 1.5
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
