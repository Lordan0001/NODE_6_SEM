import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    message:{
        type: String,
        required: true,
    },
      timestamp:{
        type: String,
          required: true,
      },
      avatarUrl:{
          type: String,
          required: true
      }

  },

);

export default mongoose.model('Message', MessageSchema);
