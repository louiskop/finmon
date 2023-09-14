const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  beneficiary: {
    type: Schema.Types.ObjectId,
    ref: "Beneficiary",
  },
  amount: {
    type: Number,
    required: true,
  },
  // inc or exp
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  processed: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
