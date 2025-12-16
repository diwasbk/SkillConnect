import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    profileImageUrl: {
        type: String,
        required: true
    },
    skills: [
        {
            category: {
                type: String,
                required: true
            },
            level: {
                type: String,
                enum: ["beginner", "intermediate", "expert"],
                required: true
            },
            charge: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true })

export default mongoose.model("Profile", profileSchema)