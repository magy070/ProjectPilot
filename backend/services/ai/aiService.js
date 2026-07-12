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

export const generateProjectIdeas = async (domain, difficulty, skills, interests) => {
  if (isGeminiAvailable()) {
    try {
      console.log('[AI Service] Routing to Gemini API (Project Ideas Generation)...');
      return await geminiAI.generateProjectIdeas(domain, difficulty, skills, interests);
    } catch (error) {
      console.warn('[AI Service] Gemini failed, falling back to local templates:', error.message);
      return await templateAI.generateProjectIdeas(domain, difficulty, skills, interests);
    }
  } else {
    console.log('[AI Service] GEMINI_API_KEY missing, using local template project generator.');
    return await templateAI.generateProjectIdeas(domain, difficulty, skills, interests);
  }
};

export const chatWithCoach = async (message, history, parameters) => {
  if (isGeminiAvailable()) {
    try {
      console.log('[AI Service] Routing to Gemini API (Chat Coach)...');
      return await geminiAI.chatWithCoach(message, history, parameters);
    } catch (error) {
      console.warn('[AI Service] Gemini chat failed, falling back to templates:', error.message);
      return await templateAI.chatWithCoach(message, history, parameters);
    }
  } else {
    console.log('[AI Service] GEMINI_API_KEY missing, using local template chat advisor.');
    return await templateAI.chatWithCoach(message, history, parameters);
  }
};
