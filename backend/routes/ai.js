import express from 'express';
import Project from '../models/Project.js';
import Synopsis from '../models/Synopsis.js';
import Prompt from '../models/Prompt.js';
import { protect } from '../middleware/authMiddleware.js';
import * as aiService from '../services/ai/aiService.js';

const router = express.Router();

// @desc    Generate synopsis for a project
// @route   POST /api/ai/synopsis/:projectId
// @access  Private
router.post('/synopsis/:projectId', protect, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Return cached synopsis if user already generated it for this project
    const existing = await Synopsis.findOne({ user: req.user.id, project: projectId });
    if (existing) {
      return res.status(200).json({
        success: true,
        cached: true,
        synopsis: existing
      });
    }

    // Call service to generate
    const data = await aiService.generateSynopsis(project);

    // Save in DB
    const synopsis = await Synopsis.create({
      user: req.user.id,
      project: projectId,
      title: data.title,
      abstract: data.abstract,
      problemStatement: data.problemStatement,
      objectives: data.objectives,
      scope: data.scope,
      techStack: data.techStack,
      expectedOutcome: data.expectedOutcome
    });

    res.status(201).json({
      success: true,
      cached: false,
      synopsis
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Generate copy-paste developer prompt for a project
// @route   POST /api/ai/prompt/:projectId
// @access  Private
router.post('/prompt/:projectId', protect, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Return cached prompt if user already generated it for this project
    const existing = await Prompt.findOne({ user: req.user.id, project: projectId });
    if (existing) {
      return res.status(200).json({
        success: true,
        cached: true,
        prompt: existing
      });
    }

    // Call service to generate
    const content = await aiService.generateDeveloperPrompt(project);

    // Save in DB
    const prompt = await Prompt.create({
      user: req.user.id,
      project: projectId,
      content
    });

    res.status(201).json({
      success: true,
      cached: false,
      prompt
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Chat with AI advisor/coach using specifications
// @route   POST /api/ai/chat
// @access  Private
router.post('/chat', protect, async (req, res, next) => {
  try {
    const { message, history, parameters } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const responseText = await aiService.chatWithCoach(message, history, parameters || {});
    res.status(200).json({
      success: true,
      reply: responseText
    });
  } catch (error) {
    next(error);
  }
});

export default router;
