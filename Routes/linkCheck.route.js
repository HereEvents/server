const express = require("express");
const linkRouter = express.Router();
const axios = require("axios");

linkRouter.get("", async (req, res) => {
  const url = req.query.q; // Retrieve the URL from the query parameters

  try {
    const response = await axios.get(url); // Use axios to make the GET request
    const status = response.status;
    console.log(response.status);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the URL" });
  }
});

module.exports = linkRouter;
