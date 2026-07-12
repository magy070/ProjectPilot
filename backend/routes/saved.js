import express from 'express';
import SavedProject from '../models/SavedProject.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Toggle saved project (bookmark/unbookmark)
// @route   POST /api/saved-projects/:projectId
// @access  Private
router.post('/:projectId', protect, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const alreadySaved = await SavedProject.findOne({ user: req.user.id, project: projectId });

    if (alreadySaved) {
      await SavedProject.deleteOne({ _id: alreadySaved._id });
      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: 'Project removed from saved list'
      });
    }

    await SavedProject.create({
      user: req.user.id,
      project: projectId
    });

    res.status(200).json({
      success: true,
      bookmarked: true,
      message: 'Project saved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all bookmarked projects for user
// @route   GET /api/saved-projects
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const saved = await SavedProject.find({ user: req.user.id })
      .populate('project')
      .sort({ createdAt: -1 });

    const projects = saved.filter(s => s.project !== null).map(s => s.project);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
});

export default router;
