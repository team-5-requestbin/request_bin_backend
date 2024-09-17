import express from "express";
import endpointRouter from "./routes/endpointRouter.js";

const app = express();

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api", endpointRouter);

// catch-all for external HTTP requests that need to be captured
app.all("/", (_req, res) => {
  // capture all HTTP Requests
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// domain.com/89a8d98xc9x3/
// domain.com/89a8d98xc9x3/view/

// domain.com/api/89a8d98xc9x3
// base_api_url = /api/

// .get('/:endpoint_id')
// .get('/:endpoint_id/:req_id')
// .post('/create')
// .delete('/:endpoint_id')
// .delete('/:endpoint_id/:req_id') - optional
