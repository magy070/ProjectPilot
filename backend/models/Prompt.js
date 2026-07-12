import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Prompt = mongoose.model('Prompt', promptSchema);
export default Prompt;
