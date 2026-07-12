import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import dbConnect from '../config/db.js';

dotenv.config();

async function run() {
  await dbConnect();
  try {
    const projectData = {
      name: "Space Invaders Clone",
      description: "A simplified version of the classic Space Invaders game",
      estimatedTime: "3 Days",
      teamSize: "3 Devs",
      techStack: ["PYTHON", "PYGAME"],
      domain: "GAME DEVELOPMENT"
    };

    let difficultyVal = 'Intermediate';
    if (projectData.difficulty && ['Beginner', 'Intermediate', 'Advanced'].includes(projectData.difficulty)) {
      difficultyVal = projectData.difficulty;
    }

    const newProject = await Project.create({
      name: projectData.name || 'AI Brainstormed Project',
      description: projectData.description || 'A custom project proposed by the AI Co-Pilot.',
      problemStatement: projectData.problemStatement || `Currently, developers lack custom sandbox tools to build a ${projectData.name || 'custom solution'}.`,
      objectives: projectData.objectives || [],
      features: projectData.features || [],
      techStack: projectData.techStack || [],
      requiredSkills: projectData.requiredSkills || [],
      difficulty: difficultyVal,
      estimatedTime: projectData.estimatedTime || '1 Month',
      resumeValue: projectData.resumeValue || `Demonstrates standard integration of a ${projectData.name || 'custom app'} stack.`,
      teamSize: parseInt(projectData.teamSize) || 2,
      domain: projectData.domain || 'Web Dev'
    });

    console.log('Success! Created:', newProject);
  } catch (error) {
    console.error('Import Error details:');
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

run();
