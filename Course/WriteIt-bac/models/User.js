import mongoose from 'mongoose';
import role from "./Role.js";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
      role:{
        type: mongoose.Schema.Types.String,
          default: 'user',
          ref: 'Role',
          required: false
      },
      subscribedTo: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: false,
          default:[],
          uniq: true,
      }],
    avatarUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
