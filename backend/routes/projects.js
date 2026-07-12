import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, projectQuerySchema } from '../middleware/validation.js';

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

export default router;
