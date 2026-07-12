export const generateSynopsis = async (project) => {
  return {
    title: `Project Synopsis: ${project.name}`,
    abstract: `This project is a detailed development plan for "${project.name}", which is in the "${project.domain}" domain. It is targeted as an ${project.difficulty} difficulty project with an estimated completion time of ${project.estimatedTime}. The architecture leverages ${project.techStack.join(', ')} to provide high performance and scalability.`,
    problemStatement: project.problemStatement,
    objectives: project.objectives,
    scope: [
      `Development and integration of all main features: ${project.features.join(', ')}.`,
      `Database design, indexing, and model optimization using MongoDB.`,
      `Styling and user experience flow development utilizing standard design parameters.`,
      `Performance optimization and unit testing protocols.`
    ],
    techStack: project.techStack,
    expectedOutcome: `A fully operational, secure, and production-grade implementation of ${project.name} that solves the core problem of fragmented or inefficient workflows.`
  };
};

export const generateDeveloperPrompt = async (project) => {
  return `You are an expert software developer and project architect. Please help me build a project named "${project.name}".
  
### Project Meta:
- **Domain**: ${project.domain}
- **Difficulty**: ${project.difficulty}
- **Time Available**: ${project.estimatedTime}
- **Target Tech Stack**: ${project.techStack.join(', ')}

### Problem Statement:
${project.problemStatement}

### Core Objectives:
${project.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

### Required Features:
${project.features.map((feat, i) => `- ${feat}`).join('\n')}

### Build Instructions:
1. **Setup**: Initialize a Node.js Express server backend and a React (Vite) frontend. Configure Tailwind CSS with dark theme settings.
2. **Database**: Create schemas matching ${project.name} requirements in MongoDB. Add constraints and validations.
3. **API Design**: Implement RESTful endpoints to support feature operations. Secure them with middleware.
4. **Frontend development**: Build responsive, premium styled pages using glassmorphism styling parameters.
5. **Integration**: Link API services using Axios, set up React Query states.
6. **Testing**: Add unit tests for key validation routines and router routes.

Please output complete, runnable code files for step 1 and step 2, and guide me on how to proceed.`;
};

export const generateProjectIdeas = async (domain, difficulty, skills, interests) => {
  // Return static mock values based on inputs as a fallback
  return [
    {
      name: `AI-Generated ${domain || 'Web'} Project Alpha`,
      description: `A custom generated plan leveraging ${skills?.slice(0, 3).join(', ') || 'React'} for solving optimization bottlenecks.`,
      problemStatement: `Inefficient workflows cause delays for users, which can be mitigated with modern ${domain || 'software'} structures.`,
      objectives: ["Analyze requirement guidelines", "Model schema relationships", "Execute test scripts"],
      features: ["Interactive user onboarding", "Dynamic parameters dashboard", "Stats report exporter"],
      techStack: [...(skills || ['React', 'Node.js']), 'MongoDB', 'Tailwind CSS'],
      requiredSkills: skills || ['React', 'Node.js'],
      difficulty: difficulty || 'Intermediate',
      estimatedTime: '1 Month',
      resumeValue: 'High: Shows capabilities in designing tailored software algorithms.',
      feasibilityScore: 90,
      teamSize: 2,
      domain: domain || 'Web Dev'
    },
    {
      name: `AI-Generated ${domain || 'Web'} Project Beta`,
      description: `A responsive framework focused on security and low-latency metrics.`,
      problemStatement: `Security threats and data leakage remain a primary risk in centralized applications.`,
      objectives: ["Setup route verification middleware", "Add end-to-end encryption", "Optimize query performance"],
      features: ["Token-based authentication", "Asset files compression", "Audit logs ledger"],
      techStack: [...(skills || ['React', 'Node.js']), 'Mongoose', 'Express'],
      requiredSkills: skills || ['React', 'Node.js'],
      difficulty: difficulty || 'Intermediate',
      estimatedTime: '2 Weeks',
      resumeValue: 'Outstanding: Reflects secure programming practices and solid architectural bounds.',
      feasibilityScore: 85,
      teamSize: 1,
      domain: domain || 'Web Dev'
    },
    {
      name: `AI-Generated ${domain || 'Web'} Project Gamma`,
      description: `A multi-tenant dashboard demonstrating advanced analytical queries.`,
      problemStatement: `Analyzing large-scale logs leaves developers digging through text files without visual aids.`,
      objectives: ["Collect sensor or system event logs", "Build real-time charts", "Configure threshold alert toggles"],
      features: ["Log ingest files parser", "Glow-accented analytics charts", "Email alert notification stubs"],
      techStack: [...(skills || ['React', 'Node.js']), 'Chart.js', 'MongoDB'],
      requiredSkills: skills || ['React', 'Node.js'],
      difficulty: difficulty || 'Intermediate',
      estimatedTime: '2 Months',
      resumeValue: 'High: Focuses on streaming log integrations and complex frontend reporting engines.',
      feasibilityScore: 88,
      teamSize: 3,
      domain: domain || 'Web Dev'
    }
  ];
};

export const chatWithCoach = async (message, history) => {
  return `Hi! I am ProjectPilot Co-Pilot (running in offline template mode).
You asked: "${message}"

Here is a recommended project I tailored for you. You can review the specs below and import it immediately into your active discoveries workspace:

[PROJECT_JSON]
{
  "name": "Conversational Web Project",
  "description": "An interactive project customized dynamically inside the AI coach chat session.",
  "problemStatement": "Developers need custom mock workspaces tailored directly from chat prompts.",
  "objectives": ["Connect web socket events", "Establish JWT tokens schemas", "Design dark UI parameters"],
  "features": ["Real-time message boards", "One-click DB importers"],
  "techStack": ["React", "Express", "Mongoose", "Tailwind CSS"],
  "requiredSkills": ["React", "Node.js"],
  "difficulty": "Intermediate",
  "estimatedTime": "1 Month",
  "resumeValue": "High: Focuses on custom conversational flows and dashboard schema hooks.",
  "feasibilityScore": 95,
  "teamSize": 2,
  "domain": "Web Dev"
}
[/PROJECT_JSON]`;
};
