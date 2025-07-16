const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      enum: ["exam", "holiday"],
      default: "exam",
    },
    start: {
      type: String, 
      required: true,
    },
    end: {
      type: String, 
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);

