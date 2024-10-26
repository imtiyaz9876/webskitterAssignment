const mongoose = require("mongoose");

const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    gender:{
      type: String,
    },

  },
  { versionKey: false }
);

module.exports = mongoose.model("User", user);
