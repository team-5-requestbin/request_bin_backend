import express from "express";
import endpointService from "../services/endpointServices.js";

const router = express.Router();

router.get("/:endpoint_hash", (req, res) => {
  try {
    const endpoint_hash = req.params.endpoint_hash;
    console.log(`getAllRequests passing endpoint_hash: ${endpoint_hash}`);
    const data = endpointService.getAllRequests(endpoint_hash);
    console.log(`data from endpoint ${endpoint_hash} is: ${data}`);
    // only send method, path, timestamp
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: "Error, requested endpoint not found" });
  }
});

router.get("/:endpoint_hash/exists", (req, res) => {
  try {
    const endpoint_hash = req.params.endpoint_hash;
    const endpointFound = endpointService.endpointExists(endpoint_hash);
    if (endpointFound) {
      const data = { exists: true };
      res.status(200).json(data);
    } else {
      const data = { exists: false };
      res.status(204).json(data);
    }
    res.json(data);
  } catch (error) {
    res.status(404).json({
      error: "Error checking if endpoint exists",
    });
  }
});

router.get("/:endpoint_hash/:request_id", (req, res) => {
  try {
    const request_id = req.params.request_id;
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
    console.log("created new endpoint_hash", endpoint_hash);

    res.json(endpoint_hash);
  } catch (error) {
    res.status(400).json({ error: "Error creating new endpoint" });
  }
});

router.delete("/:endpoint_hash", (req, res) => {
  try {
    const endpoint_hash = req.params.endpoint_hash;
    endpointService.deleteAllRequests(endpoint_hash);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: "Delete error, resource not found" });
  }
});

// OPTIONAL - delete one HTTP request
// router.delete('/:endpoint_hash/:req_id', (req, res) => {
//   try {
//     const endpoint_hash = req.params.endpoint_hash;
//     const request_id = req.params.request_id;
//     endpointService.deleteRequestById(endpoint_hash, request_id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(404).json({error: 'Delete error, resource not found'})
//   }
// })

export default router;
