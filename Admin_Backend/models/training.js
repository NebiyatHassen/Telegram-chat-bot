const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainingSchema = new Schema(
  {
    Title: {
      type: String,
      required: [true, "Title is required"],
    },
    Locations: {
      type: String,
      required: [true, "Locations is required"],
    },
    DateTime: {
      type: String,
      required: [true, "DateTime is required"],
    },
    Detail: {
      type: String,
      required: [true, "Detail is required"],
    },
    imageUrls: [String],
  },
  { timestamps: true }
);

const training = mongoose.model("training", TrainingSchema);
module.exports = training;
