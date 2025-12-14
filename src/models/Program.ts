import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExercise {
  name: string;
  sets: number;
  reps: number;
}

export interface IProgram extends Document {
  title: string;
  description?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  coachId: mongoose.Types.ObjectId;
  exercises: IExercise[];
  averageRating?: number;
  totalEnrollments: number;
  tags?: string[];
}

const ExerciseSchema: Schema<IExercise> = new Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
});

const ProgramSchema: Schema<IProgram> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    coachId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exercises: [ExerciseSchema],
    averageRating: { type: Number, default: 0 },
    totalEnrollments: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Program: Model<IProgram> =
  mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);

export default Program;
