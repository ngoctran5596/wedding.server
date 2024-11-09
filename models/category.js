const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  image: {
    type: Array,
    required: true,
  },
  description: { type: String, required: true },
});

exports.Category = mongoose.model("Category", CategorySchema);
