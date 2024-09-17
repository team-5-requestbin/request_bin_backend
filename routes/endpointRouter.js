import express from "express";
import endpointService from "../services/endpointServices.js";

const router = express.Router();

router.get("/:endpoint_id", (req, res) => {
  try {
    const endpoint_id = params.endpoint_id;
    const data = endpointService.getAllRequests(endpoint_id);
    // only send method, path, timestamp
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: "Error, requested endpoint not found" });
  }
});

router.get("/:endpoint_id/:request_id", (req, res) => {
  try {
    const request_id = params.request_id;
    const data = endpointService.getRequestById(request_id);
    // send all info from single HTTP Request

    res.json(data);
  } catch (error) {
    res.status(404).json({
      error: "Error, requested endpoint and/or HTTP request not found",
    });
  }
});

router.post("/create", (_req, res) => {
  try {
    const endpoint_hash = endpointService.createEndpoint();
    res.json(endpoint_hash);
  } catch (error) {
    res.status(400).json({ error: "Error creating new endpoint" });
  }
});

router.delete("/:endpoint_id", (req, res) => {
  try {
    const endpoint_id = params.endpoint_id;
    endpointService.deleteAllRequests(endpoint_id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: "Delete error, resource not found" });
  }
});

// OPTIONAL - delete one HTTP request
// router.delete('/:endpoint_id/:req_id', (req, res) => {
//   try {
//     const endpoint_id = params.endpoint_id;
//     const request_id = params.request_id;
//     endpointService.deleteRequestById(endpoint_id, request_id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(404).json({error: 'Delete error, resource not found'})
//   }
// })

export router;
