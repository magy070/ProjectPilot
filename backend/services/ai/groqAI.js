const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const callGroq = async (messages, responseFormatJson = false) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
  }

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.2
  };

  if (responseFormatJson) {
    payload.response_format = { type: 'json_object' };
  }

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq API returned status ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
};

export const generateSynopsis = async (project) => {
  const prompt = `You are a Senior Project Supervisor. Generate a structured technical project synopsis for:
Name: ${project.name}
Description: ${project.description}
Tech Stack: ${project.techStack.join(', ')}

Return a JSON object containing:
{
  "title": "A technical title for this proposal (e.g. 'Advanced Pygame-Based Space Invaders Clone')",
  "abstract": "Comprehensive 3-4 sentence abstract of the project",
  "problemStatement": "Detailed description of the problem solved",
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "scope": ["Scope item 1", "Scope item 2", "Scope item 3"],
  "techStack": ["Stack Item 1", "Stack Item 2"],
  "expectedOutcome": "Detailed description of the expected deliverables and outcomes of this project"
}`;

  const reply = await callGroq([
    { role: 'user', content: prompt }
  ], true);

  return JSON.parse(reply);
};

export const generateDeveloperPrompt = async (project) => {
  const prompt = `You are an expert AI system designed to help developers build projects.
Generate a comprehensive, ready-to-paste instruction prompt (suitable for ChatGPT, Claude, or Cursor) explaining how to construct this project from scratch:
Name: ${project.name}
Description: ${project.description}
Tech Stack: ${project.techStack.join(', ')}
Features: ${project.features.join(', ')}

Provide detailed folder structures, model layouts, and component templates. Return the prompt as a clean markdown response.`;

  return await callGroq([
    { role: 'user', content: prompt }
  ], false);
};

export const generateProjectIdeas = async (domain, difficulty, skills, interests) => {
  const prompt = `You are an expert software project architect.
Generate EXACTLY 3 unique, creative, and highly detailed software project ideas matching these criteria:
- Domain: ${domain || 'Web Dev'}
- Difficulty: ${difficulty || 'Intermediate'}
- Target Skills: ${skills?.join(', ') || 'React, Node.js'}
- Interests: ${interests?.join(', ') || 'Web Development'}

Return ONLY a valid JSON object containing a "projects" array of objects matching this exact database schema:
{
  "projects": [
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
}`;

  const reply = await callGroq([
    { role: 'user', content: prompt }
  ], true);

  const parsed = JSON.parse(reply);
  return parsed.projects || parsed;
};

export const chatWithCoach = async (message, history) => {
  const systemInstruction = `You are "ProjectPilot Co-Pilot", a helpful and experienced software project coach.
Your job is to help the user brainstorm, design, and structure a custom software project.
Converse with the user to understand their constraints (like timeframe, team members, and target skills) directly from their messages rather than forcing them to fill out forms.

Guide the user conversationally, suggesting architectural design choices and tech stacks.
If you propose a specific software project idea, you must format that project as a JSON block wrapped in [PROJECT_JSON] and [/PROJECT_JSON] tag blocks at the very end of your response so the system can display a button to import it directly to their dashboard.

Example format:
[PROJECT_JSON]
{
  "name": "Project Name",
  "description": "Short description of what the project does",
  "problemStatement": "Detailed problem this project solves",
  "objectives": ["Objective 1", "Objective 2"],
  "features": ["Feature 1", "Feature 2"],
  "techStack": ["React", "Express"],
  "requiredSkills": ["React"],
  "difficulty": "Intermediate",
  "estimatedTime": "1 Month",
  "resumeValue": "Resume value text description",
  "teamSize": 2,
  "domain": "Web Dev"
}
[/PROJECT_JSON]`;

  const messages = [
    { role: 'system', content: systemInstruction },
    ...(history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    })),
    { role: 'user', content: message }
  ];

  return await callGroq(messages, false);
};
