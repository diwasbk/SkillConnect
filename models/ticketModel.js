import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    ticketRequestedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ticketRequestedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "low"
    },
    description: {
        type: String,
        required: true
    },
    attachedImageUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true })

export default mongoose.model("Ticket", ticketSchema)