// import mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// create schema
const accountSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  goodLimit: {
    type: Number,
    required: true,
  },
  medLimit: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Account", accountSchema);
