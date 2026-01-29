const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
    },
}, { _id: false });

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Question title is required'],
        unique: true,
        trim: true,
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty level is required'],
        enum: ['Easy', 'Medium', 'Hard'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    inputFormat: {
        type: String,
        required: [true, 'Input format is required'],
    },
    outputFormat: {
        type: String,
        required: [true, 'Output format is required'],
    },
    constraints: {
        type: String,
        required: [true, 'Constraints are required'],
    },
    examples: {
        type: [exampleSchema],
        required: [true, 'At least one example is required'],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'At least one example is required',
        },
    },
    testCases: {
        type: Number,
        required: [true, 'Number of test cases is required'],
        min: [1, 'At least one test case is required'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
}, {
    timestamps: true,
});

// Index for faster searches
questionSchema.index({ title: 1, category: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
