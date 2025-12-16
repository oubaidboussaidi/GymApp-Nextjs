import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgramRating extends Document {
    programId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    review?: string;
}

const ProgramRatingSchema: Schema<IProgramRating> = new Schema(
    {
        programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String },
    },
    { timestamps: true }
);


ProgramRatingSchema.index({ programId: 1, userId: 1 }, { unique: true });

const ProgramRating: Model<IProgramRating> =
    mongoose.models.ProgramRating ||
    mongoose.model<IProgramRating>('ProgramRating', ProgramRatingSchema);

export default ProgramRating;
