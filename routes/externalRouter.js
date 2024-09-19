import express from "express";
import externalServices from "../services/externalServices.js";

const router = express.Router();

// router.all("/:endpoint_hash", (req, res) => { // ....bin/5ea864ca/andadditionalpath
router.all("/:endpoint_hash/:path1?/:path2?/:path3?/:path4?", (req, res) => {
    try {
    const endpoint_hash = req.params.endpoint_hash;
    console.log(`captureRequests passing endpoint_hash: ${endpoint_hash}`);
    const capturePromise = externalServices.captureRequests(endpoint_hash, req);
    capturePromise.then((result) => res.status(200).json(result));
  } catch (error) {
    res.status(404).json({ error: "Error, requested endpoint not found" });
  }
});

export default router;