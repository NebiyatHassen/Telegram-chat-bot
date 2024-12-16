const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobFairSchema = new Schema(
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

const jobfair = mongoose.model("jobfair", JobFairSchema);
module.exports = jobfair;
