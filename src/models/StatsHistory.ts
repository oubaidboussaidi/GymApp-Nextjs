import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStatsHistory extends Document {
    userId: mongoose.Types.ObjectId;
    weight?: number;
    squat?: number;
    bench?: number;
    recordedAt: Date;
}

const StatsHistorySchema: Schema<IStatsHistory> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        weight: { type: Number },
        squat: { type: Number },
        bench: { type: Number },
        recordedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);


StatsHistorySchema.index({ userId: 1, recordedAt: -1 });

const StatsHistory: Model<IStatsHistory> =
    mongoose.models.StatsHistory ||
    mongoose.model<IStatsHistory>('StatsHistory', StatsHistorySchema);

export default StatsHistory;
