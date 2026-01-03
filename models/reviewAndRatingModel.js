import mongoose, { mongo } from "mongoose";

const reviewAndRatingSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    review: {
        type: String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
}, { timestamps: true })

// Prevent duplicate reviews from same user to same user
reviewAndRatingSchema.index(
    { fromUser: 1, toUser: 1 },
    { unique: true }
);

export default mongoose.model("ReviewAndRating", reviewAndRatingSchema)