const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    required: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
