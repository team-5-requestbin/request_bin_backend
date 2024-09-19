import express from "express";
import endpointService from "../services/endpointServices.js";

const router = express.Router();

// router.get("/:endpoint_hash/exists", (req, res) => {
//   try {
//     const endpoint_hash = req.params.endpoint_hash;
//     const endpointFound = endpointService.endpointExists(endpoint_hash);
//     if (endpointFound) {
//       const data = { exists: true };
//       res.status(200).json(data);
//     } else {
//       const data = { exists: false };
//       res.status(204).json(data);
//     }
//     res.json(data);
//   } catch (error) {
//     res.status(404).json({
//       error: "Error checking if endpoint exists",
//     });
//   }
// });

router.get("/:endpoint_hash", (req, res) => {
  try {
    const endpoint_hash = req.params.endpoint_hash;
    // console.log(`getAllRequests passing endpoint_hash: ${endpoint_hash}`);
    const dataPromise = endpointService.getAllRequests(endpoint_hash);
    dataPromise.then((result) => {
      // console.log(`getAllRequests result is = ${result}`)
      res.json(result)
    })
    // console.log(`data from endpoint ${endpoint_hash} is: ${dataPromise}`);
    // only send method, path, timestamp
    // res.json(data);
  } catch (error) {
    res.status(404).json({ error: "Error, requested endpoint not found" });
  }
});

router.get("/:endpoint_hash/:request_hash", (req, res) => {
  try {
    const request_hash = req.params.request_hash;
    const dataPromise = endpointService.getRequestById(request_hash);
    dataPromise.then((result) => {
      res.json(result)
    })
  } catch (error) {
    res.status(404).json({
      error: "Error, requested endpoint and/or HTTP request not found",
    });
  }
});

router.post("/create", (_req, res) => {
  try {
    const hashPromise = endpointService.createEndpoint();
    // console.log("created new endpoint_hash", endpoint_hash);
    hashPromise.then((result) => {res.json(result)});
    // res.json(endpoint_hash);
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
