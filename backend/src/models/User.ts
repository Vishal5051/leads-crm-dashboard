import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['Admin', 'Sales User'],
      default: 'Sales User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);

