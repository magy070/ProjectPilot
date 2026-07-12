import express from 'express';
import SavedProject from '../models/SavedProject.js';
import Synopsis from '../models/Synopsis.js';
import Prompt from '../models/Prompt.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const savedCount = await SavedProject.countDocuments({ user: userId });
    const synopsisCount = await Synopsis.countDocuments({ user: userId });
    const promptCount = await Prompt.countDocuments({ user: userId });

    // Projects explored = unique set of projects user bookmarked or generated assets for
    const [savedProjects, synopses, prompts] = await Promise.all([
      SavedProject.find({ user: userId }).distinct('project'),
      Synopsis.find({ user: userId }).distinct('project'),
      Prompt.find({ user: userId }).distinct('project'),
    ]);

    const uniqueProjects = new Set([
      ...savedProjects.map(id => id.toString()),
      ...synopses.map(id => id.toString()),
      ...prompts.map(id => id.toString())
    ]);

    res.status(200).json({
      success: true,
      stats: {
        savedProjects: savedCount,
        synopsesGenerated: synopsisCount,
        promptsGenerated: promptCount,
        projectsExplored: uniqueProjects.size
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
