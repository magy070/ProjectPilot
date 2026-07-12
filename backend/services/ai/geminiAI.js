import { GoogleGenerativeAI } from '@google/generative-ai';

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export const generateSynopsis = async (project) => {
  const model = getModel();
  const prompt = `You are an expert full-stack developer and technical writer. 
Generate a structured project synopsis for the following project:
Name: ${project.name}
Description: ${project.description}
Domain: ${project.domain}
Difficulty: ${project.difficulty}
Tech Stack: ${project.techStack.join(', ')}
Problem Statement: ${project.problemStatement}

Return ONLY a valid JSON object matching this exact schema:
{
  "title": "String title",
  "abstract": "String abstract (1 paragraph)",
  "problemStatement": "String problem statement",
  "objectives": ["String objective 1", "String objective 2"],
  "scope": ["String scope 1", "String scope 2"],
  "techStack": ["tech 1", "tech 2"],
  "expectedOutcome": "String expected outcome"
}
Ensure response is raw valid JSON without markdown wrapping (no \`\`\`json).`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Clean potential markdown blocks
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

export const generateDeveloperPrompt = async (project) => {
  const model = getModel();
  const prompt = `You are an expert AI system designed to help developers build projects.
Generate a comprehensive, ready-to-paste instruction prompt (suitable for ChatGPT, Claude, or Cursor) explaining how to construct this project from scratch:
Name: ${project.name}
Description: ${project.description}
Tech Stack: ${project.techStack.join(', ')}
Features: ${project.features.join(', ')}

Provide detailed folder structures, model layouts, and component templates. Return the prompt as a clean markdown response.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateProjectIdeas = async (domain, difficulty, skills, interests) => {
  const model = getModel();
  const prompt = `You are an expert software project architect.
Generate EXACTLY 3 unique, creative, and highly detailed software project ideas matching these criteria:
- Domain: ${domain || 'Web Dev'}
- Difficulty: ${difficulty || 'Intermediate'}
- Target Skills: ${skills?.join(', ') || 'React, Node.js'}
- Interests: ${interests?.join(', ') || 'Web Development'}

Return ONLY a valid JSON array of objects matching this exact database schema:
[
  {
    "name": "Project Name",
    "description": "Short description of what the project does",
    "problemStatement": "Detailed problem this project solves",
    "objectives": ["Objective 1", "Objective 2", "Objective 3"],
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "techStack": ["React", "Express", "MongoDB", "Tailwind CSS"],
    "requiredSkills": ["React", "Node.js"],
    "difficulty": "${difficulty || 'Intermediate'}",
    "estimatedTime": "1 Month",
    "resumeValue": "Explanation of how this adds value to a resume/CV",
    "feasibilityScore": 85,
    "teamSize": 2,
    "domain": "${domain || 'Web Dev'}"
  }
]
Do not wrap response in markdown code blocks (no \`\`\`json), return raw JSON.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};
