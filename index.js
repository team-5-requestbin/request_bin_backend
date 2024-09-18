import express from "express";
import endpointRouter from "./routes/endpointRouter.js";

const app = express();

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api", endpointRouter);

// catch-all for external HTTP requests that need to be captured
app.all("/", (req, res) => {
  // call externalService and pass in request body (req)
  // receiving = capture and put into 2 databases
  // capture all HTTP Requests
  // generate request hash
  // parse HTTP request method, path, body
  // INSERT into Mongo endpoint_hash, request_hash, and request_raw
  // INSERT into Postgres request_hash, method, path, body
  // respond to external site with status 200 or 400
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Hashes are all alphanumeric strings, length 8
// - endpoint_hash
// - request_hash

// Jesse & Wook - API proposal:
// domain.com/89a8d98x/
// domain.com/89a8d98x/view/

// base_api_url = /api/
// (domain.com/api/89a8d98x)

// .get('/:endpoint_hash')
// .get('/:endpoint_hash/exists')
// .get('/:endpoint_hash/:request_hash') => we need them to keep request_ids in the UI for when they want to get a single HTTP Request by ID
// .post('/create')
// .delete('/:endpoint_hash')

// # .delete('/:endpoint_hash/:request_hash') - optional
