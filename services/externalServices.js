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

const endpointExists = async (endpoint_hash) => {
  console.log(
    `validating requested endpoint: ${endpoint_hash}`
  );

  const query = {
    name: `check endpoint existence ${endpoint_hash}`,
    text: `SELECT * FROM endpoints WHERE endpoint_hash = '${endpoint_hash}'`,
  };
  const data = await client.query(query);
  console.log(`endpoint validation query returned ${data.rowCount}`);
  return data.rowCount;
}

const captureRequests = async (endpoint_hash, req) => {
  console.log(
    `running captureRequests in externalServices with endpoint: '${endpoint_hash}'`
  );
  endpointExists(endpoint_hash)
    .then((result) => {
      if (result) {
        const request_hash = generateRandomHash();
        // console.log(request_hash);
        const request_header = JSON.stringify(req.headers);
        const request_body = JSON.stringify(req.body);
        const request_query = JSON.stringify(req.query);
        const request_path = req.path.slice(9);

        const query = {
          name: `create_new_http_request ${request_hash}`,
          text: 'INSERT INTO http_requests (method, headers, body, request_hash, endpoint_hash, path, query_params)' +
                `VALUES('${req.method}', '${request_header}', '${request_body}', '${request_hash}', '${endpoint_hash}', '${request_path}', '${request_query}')` +
                'RETURNING endpoint_hash, request_hash',
        };
    
        try {
          const data = client.query(query);
          return data.rows[0];
        } catch (error) {
          return {
            error: 'database write failure',
          };
        }
      } else {
        return {
          error: `requested endpoint ${endpoint_hash} not found`,
        };
      }
    })
  }

export default {
  captureRequests,
};