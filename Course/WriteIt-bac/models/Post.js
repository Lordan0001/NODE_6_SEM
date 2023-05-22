import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
      likes: [{ type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: 0,
          required: true }],
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);
