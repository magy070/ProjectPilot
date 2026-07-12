import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, projectQuerySchema } from '../middleware/validation.js';
import * as aiService from '../services/ai/aiService.js';

const router = express.Router();

// @desc    Get filtered list of projects
// @route   GET /api/projects
// @access  Public
router.get('/', validate(projectQuerySchema, 'query'), async (req, res, next) => {
  try {
    const { domain, difficulty, teamSize, estimatedTime } = req.query;
    const query = {};

    if (domain) query.domain = domain;
    if (difficulty) query.difficulty = difficulty;
    if (teamSize) query.teamSize = parseInt(teamSize, 10);
    if (estimatedTime) query.estimatedTime = estimatedTime;

    const projects = await Project.find(query);
    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get personalized recommended projects
// @route   GET /api/projects/recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const projects = await Project.find({});
    
    // Calculate feasibility score based on user skills & interests
    const rankedProjects = projects.map(proj => {
      let score = proj.feasibilityScore || 75; // base score
      let matchCount = 0;

      // Check skill matches
      proj.requiredSkills.forEach(reqSkill => {
        const matches = user.skills.some(userSkill => 
          userSkill.toLowerCase().trim() === reqSkill.toLowerCase().trim()
        );
        if (matches) {
          score += 6; // matching skill
          matchCount++;
        }
      });

      // Deduct if zero matching skills
      if (proj.requiredSkills.length > 0 && matchCount === 0) {
        score -= 10;
      }

      // Check domain match against user interests
      const interestMatch = user.interests.some(interest =>
        interest.toLowerCase().trim() === proj.domain.toLowerCase().trim()
      );
      if (interestMatch) {
        score += 10;
      }

      // Clamp score between 30 and 100
      const personalizedScore = Math.max(30, Math.min(100, score));

      return {
        ...proj.toObject(),
        personalizedScore
      };
    });

    // Sort descending by personalizedScore
    rankedProjects.sort((a, b) => b.personalizedScore - a.personalizedScore);

    res.status(200).json({
      success: true,
      count: rankedProjects.length,
      projects: rankedProjects
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Generate personalized project ideas with AI
// @route   POST /api/projects/generate
// @access  Private
router.post('/generate', protect, async (req, res, next) => {
  try {
    const { domain, difficulty } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Call service to generate 3 customized projects
    const rawIdeas = await aiService.generateProjectIdeas(
      domain || (user.interests.length > 0 ? user.interests[0] : 'Web Dev'),
      difficulty || 'Intermediate',
      user.skills,
      user.interests
    );

    // Save generated ideas to Project database so they can be matched and bookmarked
    const createdProjects = await Project.insertMany(rawIdeas);

    res.status(201).json({
      success: true,
      projects: createdProjects
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get project details by ID
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Import a custom generated project into the database
// @route   POST /api/projects/import
// @access  Private
router.post('/import', protect, async (req, res, next) => {
  try {
    const projectData = req.body;
    
    // Normalize difficulty enum value
    let difficultyVal = 'Intermediate';
    if (projectData.difficulty && ['Beginner', 'Intermediate', 'Advanced'].includes(projectData.difficulty)) {
      difficultyVal = projectData.difficulty;
    }

    // Create new project entry in the DB with strong defaults for required schema fields
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

    res.status(201).json({
      success: true,
      project: newProject
    });
  } catch (error) {
    next(error);
  }
});

export default router;
