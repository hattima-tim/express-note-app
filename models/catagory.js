const mongoose = require("mongoose");
const { Schema } = mongoose;

const CatagorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 16,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Catagory", CatagorySchema);
