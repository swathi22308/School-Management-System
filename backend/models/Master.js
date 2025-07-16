// models/Master.js

const mongoose = require("mongoose");

const masterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    color: {
      type: String,
      default: function () {
        return this.status === "Active" ? "#4caf50" : "#f44336";
      },
    },
    type: {
      type: String,
      required: true, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Master", masterSchema);
