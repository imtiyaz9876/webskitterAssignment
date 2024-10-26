const mongoose = require('mongoose');


// const user = mongoose.Schema(
const questionSchema = mongoose.Schema({
    question: { type: String, required: true }, // The question text
    categories: [{ type: String, required: true }], // Use an array for multiple categories
});


module.exports = mongoose.model('Questions', questionSchema);