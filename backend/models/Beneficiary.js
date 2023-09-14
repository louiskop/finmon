const mongoose = require("mongoose");
const { Schema } = mongoose;

const beneficiarySchema = Schema({
  code: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
});

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
