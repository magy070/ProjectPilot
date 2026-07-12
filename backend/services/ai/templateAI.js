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
