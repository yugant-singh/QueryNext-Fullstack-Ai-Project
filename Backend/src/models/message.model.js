import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'Please provide a chat id'],
    },
    content: {
      type: String,
      required: [true, 'Please provide message content'],
    },
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: [true, 'Please specify the message role'],
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model('Message', messageSchema);
export default messageModel;
