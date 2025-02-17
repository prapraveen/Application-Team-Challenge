const express = require("express");
const { participants } = require("./data");
const cors = require("cors");

const app = express();

app.use(cors())

app.get("/participants", (_, res) => {
  res.json(participants);
});

module.exports = { app };
