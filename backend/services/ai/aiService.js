import * as geminiAI from './geminiAI.js';
import * as groqAI from './groqAI.js';
import * as templateAI from './templateAI.js';

const getPreferredProvider = () => {
  const envProvider = (process.env.AI_PROVIDER || 'gemini').toLowerCase().trim();
  
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;

  if (envProvider === 'groq' && hasGroq) return 'groq';
  if (envProvider === 'gemini' && hasGemini) return 'gemini';

  // Fallback defaults if selection is unavailable or has missing key
  if (hasGroq) return 'groq';
  if (hasGemini) return 'gemini';
  
  return 'template';
};

export const generateSynopsis = async (project) => {
  const provider = getPreferredProvider();
  
  if (provider === 'groq') {
    try {
      console.log('[AI Service] Routing to Groq API (Synopsis)...');
      return await groqAI.generateSynopsis(project);
    } catch (error) {
      console.warn('[AI Service] Groq Synopsis failed, falling back:', error.message);
    }
  }

  if (provider === 'gemini' || (provider === 'groq' && !!process.env.GEMINI_API_KEY)) {
    try {
      console.log('[AI Service] Routing to Gemini API (Synopsis)...');
      return await geminiAI.generateSynopsis(project);
    } catch (error) {
      console.warn('[AI Service] Gemini Synopsis failed, falling back:', error.message);
    }
  }

  console.log('[AI Service] Using local template engine for Synopsis.');
  return await templateAI.generateSynopsis(project);
};

export const generateDeveloperPrompt = async (project) => {
  const provider = getPreferredProvider();

  if (provider === 'groq') {
    try {
      console.log('[AI Service] Routing to Groq API (Prompt)...');
      return await groqAI.generateDeveloperPrompt(project);
    } catch (error) {
      console.warn('[AI Service] Groq Prompt failed, falling back:', error.message);
    }
  }

  if (provider === 'gemini' || (provider === 'groq' && !!process.env.GEMINI_API_KEY)) {
    try {
      console.log('[AI Service] Routing to Gemini API (Prompt)...');
      return await geminiAI.generateDeveloperPrompt(project);
    } catch (error) {
      console.warn('[AI Service] Gemini Prompt failed, falling back:', error.message);
    }
  }

  console.log('[AI Service] Using local template engine for Prompt.');
  return await templateAI.generateDeveloperPrompt(project);
};

export const generateProjectIdeas = async (domain, difficulty, skills, interests) => {
  const provider = getPreferredProvider();

  if (provider === 'groq') {
    try {
      console.log('[AI Service] Routing to Groq API (Project Ideas)...');
      return await groqAI.generateProjectIdeas(domain, difficulty, skills, interests);
    } catch (error) {
      console.warn('[AI Service] Groq Ideas failed, falling back:', error.message);
    }
  }

  if (provider === 'gemini' || (provider === 'groq' && !!process.env.GEMINI_API_KEY)) {
    try {
      console.log('[AI Service] Routing to Gemini API (Project Ideas)...');
      return await geminiAI.generateProjectIdeas(domain, difficulty, skills, interests);
    } catch (error) {
      console.warn('[AI Service] Gemini Ideas failed, falling back:', error.message);
    }
  }

  console.log('[AI Service] Using local template engine for Project Ideas.');
  return await templateAI.generateProjectIdeas(domain, difficulty, skills, interests);
};

export const chatWithCoach = async (message, history) => {
  const provider = getPreferredProvider();

  if (provider === 'groq') {
    try {
      console.log('[AI Service] Routing to Groq API (Chat Coach)...');
      return await groqAI.chatWithCoach(message, history);
    } catch (error) {
      console.warn('[AI Service] Groq Chat failed, falling back:', error.message);
    }
  }

  if (provider === 'gemini' || (provider === 'groq' && !!process.env.GEMINI_API_KEY)) {
    try {
      console.log('[AI Service] Routing to Gemini API (Chat Coach)...');
      return await geminiAI.chatWithCoach(message, history);
    } catch (error) {
      console.warn('[AI Service] Gemini Chat failed, falling back:', error.message);
    }
  }

  console.log('[AI Service] Using local template engine for Chat Coach.');
  return await templateAI.chatWithCoach(message, history);
};
