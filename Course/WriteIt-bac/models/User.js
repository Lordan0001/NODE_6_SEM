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
          ref: 'Role',
          required: false
      },
    avatarUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
