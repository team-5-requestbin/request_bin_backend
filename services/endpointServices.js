// const getAllRequests(endpoint_hash);
// const getRequestById(endpoint_hash, request_id);
// const newEndpoint();
// const deleteAllRequests(endpoint_hash);
// const deleteRequestById(endpoint_hash, request_id);

import pg from "pg";
const { Client } = pg;
import "dotenv/config";

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

const getAllRequests = async (endpoint_hash) => {
  console.log(
    `running getAllRequests in services with endpoint: ${endpoint_hash}`
  );

  const query = {
    name: "fetch all data",
    text: `SELECT request_hash, timestamp, method, path FROM http_requests WHERE endpoint_hash = ${endpoint_hash}`,
  };

  try {
    const data = await client.query(query);
    console.log(`data just after services request: ${data}`);

    return data.rows;
  } catch (error) {
    console.error(error.message);
    return {
      error: `error getting all requests for endpoint: ${endpoint_hash}`,
    };
  }
};

const getRequestById = async (request_hash) => {
  const query = {
    name: "fetch one http request",
    text: `SELECT * FROM http_requests WHERE request_hash = ${request_hash}`,
  };

  try {
    const data = await client.query(query);
    res.send(data.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.send(error.message).status(404);
  }
};

const endpointExists = async (endpoint_hash) => {
  console.log(
    `running endpointExists in services with endpoint: ${endpoint_hash}`
  );

  const query = {
    name: "check endpoint existence",
    text: `SELECT * FROM http_requests WHERE endpoint_hash = ${endpoint_hash}`,
  };

  try {
    const data = await client.query(query);

    return data.rows;
  } catch (error) {
    console.error(error.message);
    return { error: `error checking existence of endpoint: ${endpoint_hash}` };
  }
};

const createEndpoint = async () => {
  const random_hash = generateRandomHash();

  const query = {
    name: "create_new_endpoint",
    text: `INSERT INTO endpoints (endpoint_hash) VALUES(${random_hash}) RETURNING endpoint_hash`,
  };

  try {
    const data = await client.query(query);
    res.status(201).send(data.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.send(error.message).status(500);
  }
};

const deleteAllRequests = async (endpoint_hash) => {
  const query = {
    name: "deleting_note",
    text: `DELETE FROM http_requests WHERE endpoint_hash = ${endpoint_hash}`,
  };

  try {
    await client.query(query);
    res.status(204).end();
  } catch (error) {
    console.error(error.message).status(404);
  }
};

export default {
  getAllRequests,
  getRequestById,
  createEndpoint,
  deleteAllRequests,
};
