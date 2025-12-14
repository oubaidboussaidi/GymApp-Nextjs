import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  programId: mongoose.Types.ObjectId;
  joinedAt: Date;
  status: 'active' | 'completed';
  progress: number;
  completedExercises: string[];
  lastActivityDate?: Date;
}

const EnrollmentSchema: Schema<IEnrollment> = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    joinedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedExercises: [{ type: String }],
    lastActivityDate: { type: Date },
  },
  { timestamps: true }
);

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

export default Enrollment;
