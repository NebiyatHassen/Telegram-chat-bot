const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignSchema = new Schema(
  {
    Title: {
      type: Object,
      required: [true, "Title is required"],
    },
    Locations: {
      type: Object,
      required: [true, "Locations is required"],
    },
    DateTime: {
      type: Object,
      required: [true, "DateTime is required"],
    },
    Detail: {
      type: Object,
      required: [true, "Detail is required"],
    },
    imageUrls: [Object],
  },
  { timestamps: true }
);

const campaigns = mongoose.model("campaigns", CampaignSchema);
module.exports = campaigns;
