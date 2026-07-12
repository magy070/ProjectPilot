import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  problemStatement: {
    type: String,
    required: true,
  },
  objectives: [{
    type: String,
  }],
  features: [{
    type: String,
  }],
  techStack: [{
    type: String,
    trim: true,
  }],
  requiredSkills: [{
    type: String,
    trim: true,
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  estimatedTime: {
    type: String, // '1 Week', '2 Weeks', '1 Month', '2 Months', 'Semester'
    required: true,
  },
  resumeValue: {
    type: String,
    required: true,
  },
  feasibilityScore: {
    type: Number,
    default: 80,
  },
  teamSize: {
    type: Number,
    required: true,
  },
  domain: {
    type: String, // 'Web Dev', 'AI/ML', 'Cybersecurity', 'Blockchain', 'IoT', 'Cloud'
    required: true,
  }
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
