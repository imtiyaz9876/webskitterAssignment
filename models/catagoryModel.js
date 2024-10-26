const mongoose = require('mongoose');


// const user = mongoose.Schema(
const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
});


module.exports = mongoose.model('Category', categorySchema);
