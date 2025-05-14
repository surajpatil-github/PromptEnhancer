# Use Node.js 18 as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for production builds
RUN apk add --no-cache python3 make g++

# Copy server package files
COPY package*.json ./

# Copy client package files
COPY client/package*.json ./client/

# Install server dependencies
RUN npm ci

# Copy entire client directory (including public/ and src/)
COPY client ./client/

# Build React app
WORKDIR /app/client
RUN npm ci
RUN npm run build

# Return to app root directory
WORKDIR /app

# Copy server files
COPY server.js ./
COPY data ./data/
COPY routes ./routes/

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=5000

# Create a non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeuser && \
    chown -R nodeuser:nodejs /app
USER nodeuser

# Expose the port for the server
EXPOSE 5000

# Create a directory for inserts.js if it doesn't exist
RUN mkdir -p /app/data

# Create the inserts.js file if it doesn't exist
RUN if [ ! -f /app/data/inserts.js ]; then \
    echo "module.exports = { \
      be_specific: \"Be as specific as possible in your answer.\", \
      be_concise: \"Provide a concise and direct response.\", \
      be_creative: \"Use creative thinking to address this question.\", \
      be_technical: \"Use technical language appropriate for the subject matter.\", \
      be_simple: \"Explain this in simple terms that anyone can understand.\", \
      be_professional: \"Maintain a professional tone in your response.\", \
      be_friendly: \"Respond in a friendly, conversational manner.\", \
      be_formal: \"Use formal language in your response.\", \
      be_casual: \"Keep the language casual and approachable.\", \
      be_structured: \"Structure your response clearly with sections or bullet points where appropriate.\" \
    };" > /app/data/inserts.js; \
  fi

# Command to start the server
CMD ["node", "server.js"]
