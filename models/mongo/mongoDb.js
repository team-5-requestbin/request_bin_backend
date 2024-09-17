require("dotenv").config();
const mongoose = require("mongoose");
const Note = require("./notes");

const mongoDbUrl = process.env.MONGO_URI;

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("MongoDB Connection Successful!");
  })
  .catch(() => {
    console.log("MongoDB Connection Failed!");
  });

const createNote = async (req, res) => {
  const createNote = new Note({
    note: req.body.note,
  });

  const result = await createNote.save();

  res.json(result);
};

const getNotes = async (req, res) => {
  const notes = await Note.find().exec();

  res.json(notes);
};

const updateNote = async (req, res) => {
  const id = req.params.id;
  const body = req.body.note;

  try {
    const data = await Note.findByIdAndUpdate(id, {
      note: body,
    });

    res.json(data);
  } catch (error) {
    alert(error.message);
  }
};

const deleteNote = async (req, res) => {
  id = req.params.id;

  try {
    await Note.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    alert(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
