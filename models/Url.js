const mongoose = require("mongoose");

const urlSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: "ObjectId",
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
