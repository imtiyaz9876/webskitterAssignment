// questionModel.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // The question text
    categories: [{ type: String, required: true }], // Use an array for multiple categories
});

// Create an index on the `categories` array field to speed up queries
questionSchema.index({ categories: 1 });

// Optional: Create a full-text index on the `question` field for text search
questionSchema.index({ question: 'text' });

module.exports = mongoose.model('Questions', questionSchema);
