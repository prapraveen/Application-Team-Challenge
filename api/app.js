const express = require("express");
const { participants } = require("./data");

const app = express();

app.get("/participants", (_, res) => {
  res.json(participants);
});

module.exports = { app };
