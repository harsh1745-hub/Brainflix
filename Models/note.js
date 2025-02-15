import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Number,  
        required: true,
        min: 0  
    },
    tags: [{
        type: String,
        trim: true
    }],
    aiEnhancements: {
        summary: { type: String, trim: true },
        keyPoints: [{ type: String, trim: true }],
        relatedConcepts: [{ type: String, trim: true }]
    },
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true 
        },
        permission: {
            type: String,
            enum: ['read', 'write'],
            default: 'read'
        }
    }],
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
noteSchema.index({ videoId: 1, userId: 1, timestamp: 1 });

export default mongoose.model('Note', noteSchema);
