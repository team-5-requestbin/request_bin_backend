const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  note: { type: String, minLength: 2, required: [true, " Note required"] },
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
