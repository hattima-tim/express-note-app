const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  details: {
    type: String,
    required: true,
    minlength: 3,
  },
  catagory: {
    type: Schema.Types.ObjectId,
    ref: "Catagory",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

NoteSchema.virtual("url").get(function () {
  return `/catagory/notes/${this._id}`;
});

module.exports = mongoose.model("Note", NoteSchema);
