import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user id'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a chat title'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model('Chat', chatSchema);
export default chatModel;
