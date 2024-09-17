// const getAllRequests(endpoint_id);
// const getRequestById(endpoint_id, request_id);
// const newEndpoint();
// const deleteAllRequests(endpoint_id);
// const deleteRequestById(endpoint_id, request_id);

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

function generateRandomHash() {
  const hash_length = 8;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;

  while (counter < hash_length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

const getAllRequests = async (endpoint_id) => {
  const query = {
    name: "fetch all data",
    text: `SELECT request_id, timestamp, method, path FROM http_requests WHERE endpoint_id = ${endpoint_id}`,
  };

  try {
    const data = await client.query(query);
    res.send(data.rows);
  } catch (error) {
    console.error(error.message);
    res.send(error.message).status(400);
  }
};

const getRequestById = async (request_id) => {
  const query = {
    name: "fetch one http request",
    text: `SELECT * FROM http_requests WHERE request_id = ${request_id}`,
  };

  try {
    const data = await client.query(query);
    res.send(data.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.send(error.message).status(404);
  }
};

const createEndpoint = async () => {
  const random_hash = generateRandomHash();

  const query = {
    name: "create_new_endpoint",
    text: `INSERT INTO endpoints(endpoint_hash) VALUES(${random_hash}) RETURNING endpoint_hash`,
  };

  try {
    const data = await client.query(query);
    res.status(201).send(data.rows[0]);
  } catch (error) {
    console.error(error.message).status(500);
  }
};

const deleteAllRequests = async (endpoint_id) => {
  const query = {
    name: "deleting_note",
    text: `DELETE FROM http_requests WHERE endpoint_id = ${endpoint_id}`,
  };

  try {
    await client.query(query);
    res.status(204).end();
  } catch (error) {
    console.error(error.message).status(404);
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  createEndpoint,
  deleteAllRequests,
};
