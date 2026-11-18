
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    problemId: {
        type: Number,
        required: true
    },

    problemTitle: {
        type: String,
        required: true
    },

    language: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    passed: {
        type: Number,
        required: true
    },

    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Submission", submissionSchema);
