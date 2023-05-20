const mongoose = require("mongoose");
const { Schema } = mongoose;

const CatagorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
});

CatagorySchema.virtual("url").get(function () {
  return `catagory/${this._id}`;
});

module.exports = mongoose.model("Catagory", CatagorySchema);
