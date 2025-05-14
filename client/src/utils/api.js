import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const enhancePrompt = async (apiKey, prompt, model, skills, phrases, useEnglish, useSimplified) => {
  try {
    const response = await axios.post(`${API_URL}/enhance`, {
      apiKey,
      prompt,
      model,
      skills,
      phrases,
      useEnglish,
      useSimplified
    });
    
    return response.data;
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    throw error;
  }
};
