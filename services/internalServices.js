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
    `running getAllRequests in services with endpoint: '${endpoint_hash}'`
  );

  const query = {
    name: `fetch all data for ${endpoint_hash}`,
    text: `SELECT request_hash, received_at, method, path FROM http_requests WHERE endpoint_hash = '${endpoint_hash}'`,
  };

  try {
    const data = await client.query(query);
    console.log(`data just after services request: ${data}`);

    return data.rows;
    // return dataPromise.then((result) => result.rows);
  } catch (error) {
    console.error(error.message);
    return {
      error: `error getting all requests for endpoint: ${endpoint_hash}`,
    };
  }
};

const getRequestById = async (request_hash) => {
  const query = {
    name: `fetch one http request ${request_hash}`,
    text: `SELECT * FROM http_requests WHERE request_hash = '${request_hash}'`,
  };

  try {
    const data = await client.query(query);
    return data.rows[0];
    // res.send(data.rows[0]);
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
    // customize name property to include endpoint_hash 
    name: `check endpoint existence ${endpoint_hash}`,
    // query from endpoints rather than http_requests
    // add single quotes on the endpoint hash to avoid query error
    text: `SELECT * FROM endpoints WHERE endpoint_hash = '${endpoint_hash}'`,
  };

  try {
    const data = await client.query(query);
    // take advantage of .rowCount property to return either an integer or null
    return data.rowCount;
  } catch (error) {
    console.error(error.message);
    return { error: `error checking existence of endpoint: ${endpoint_hash}` };
  }
};

const createEndpoint = async () => {
  const random_hash = generateRandomHash();

  const query = {
    name: `create_new_endpoint ${random_hash}`,
    text: `INSERT INTO endpoints (endpoint_hash) VALUES('${random_hash}') RETURNING endpoint_hash`,
  };

  try {
    const data = await client.query(query);
    return data.rows[0];
    // res.status(201).send(data.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.send(error.message).status(500);
  }
};

const deleteAllRequests = async (endpoint_hash) => {
  const query = {
    name: "deleting_note",
    // text: `DELETE FROM http_requests WHERE endpoint_hash = '${endpoint_hash}'`,
    // above SQL only deletes from http_requests, leaving behind an endpoint_hash
    //   in the endpoints table
    // change below deletes endpoint_hash from endpoints table, triggering
    //   on delete cascade to delete from http_requests table
    // text: `DELETE FROM endpoints WHERE endpoint_hash = '${endpoint_hash}'`,
    text: `DELETE FROM http_requests WHERE endpoint_hash = '${endpoint_hash}'`,
  };

  try {
    await client.query(query);
    // res.status(204).end();
  } catch (error) {
    console.error(error.message).status(404);
  }
};

export default {
  getAllRequests,
  getRequestById,
  endpointExists,
  createEndpoint,
  deleteAllRequests,
};
