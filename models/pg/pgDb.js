require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error(err, "Error Connection to PostgreSQL"));

const getRequests = async (req, res) => {
  const endpoint_id = req.params.endpoint_id;

  const query = {
    name: "fetch all data",
    text: "SELECT * FROM http_requests WHERE endpoint = endpoint_id",
  };

  try {
    const data = await client.query(query);
    res.send(data.rows);
  } catch (error) {
    console.error(error.message);
    res.send(error.message).status(400);
  }
};

const createNote = async (req, res) => {
  note = req.body.note;

  const query = {
    name: "create_new_note",
    text: "INSERT INTO notes(note) VALUES($1) RETURNING id, note",
    values: [note],
  };

  try {
    const data = await client.query(query);
    res.status(201).send(data.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
};

const deleteNote = async (req, res) => {
  const id = Number(req.params.id);

  const query = {
    name: "deleting_note",
    text: "DELETE FROM notes WHERE id = $1",
    values: [id],
  };

  try {
    await client.query(query);
    res.status(204).end();
  } catch (error) {
    console.error(error.message);
  }
};

const updateNote = async (req, res) => {
  const id = Number(req.params.id);
  const updatedNote = req.body.note;

  const query = {
    name: "updating_note",
    text: "UPDATE notes SET note = $1 WHERE id = $2",
    values: [updatedNote, id],
  };

  try {
    await client.query(query);
    res.send({ message: "Note Updated!" });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { getNotes, createNote, deleteNote, updateNote };
