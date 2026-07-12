import * as geminiAI from './geminiAI.js';
import * as templateAI from './templateAI.js';

const isGeminiAvailable = () => {
  return !!process.env.GEMINI_API_KEY;
};

export const generateSynopsis = async (project) => {
  if (isGeminiAvailable()) {
    try {
      console.log('[AI Service] Routing to Gemini API...');
      return await geminiAI.generateSynopsis(project);
    } catch (error) {
      console.warn('[AI Service] Gemini failed, falling back to local templates:', error.message);
      return await templateAI.generateSynopsis(project);
    }
  } else {
    console.log('[AI Service] GEMINI_API_KEY missing, using local template engine.');
    return await templateAI.generateSynopsis(project);
  }
};

export const generateDeveloperPrompt = async (project) => {
  if (isGeminiAvailable()) {
    try {
      console.log('[AI Service] Routing to Gemini API...');
      return await geminiAI.generateDeveloperPrompt(project);
    } catch (error) {
      console.warn('[AI Service] Gemini failed, falling back to local templates:', error.message);
      return await templateAI.generateDeveloperPrompt(project);
    }
  } else {
    console.log('[AI Service] GEMINI_API_KEY missing, using local template engine.');
    return await templateAI.generateDeveloperPrompt(project);
  }
};
