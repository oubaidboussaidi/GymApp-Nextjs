import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'coach' | 'client';
  image?: string;
  age?: number;
  isActive: boolean;
  physicalStats?: {
    weight?: number;
    squat?: number;
    bench?: number;
  };
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'coach', 'client'],
      default: 'client',
    },
    image: { type: String },
    age: { type: Number },
    isActive: { type: Boolean, default: true },
    physicalStats: {
      weight: { type: Number },
      squat: { type: Number },
      bench: { type: Number },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
