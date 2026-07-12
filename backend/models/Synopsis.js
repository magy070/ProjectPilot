import mongoose from 'mongoose';

const synopsisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  abstract: {
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
  scope: [{
    type: String,
  }],
  techStack: [{
    type: String,
  }],
  expectedOutcome: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Synopsis = mongoose.model('Synopsis', synopsisSchema);
export default Synopsis;
