const mongoose = require("mongoose");
const { Schema } = mongoose;

const CatagorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 16,
  },
});

module.exports = mongoose.model("Catagory", CatagorySchema);
