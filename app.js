const express = require("express");

const api = require("./routes/api.js");
const app = express();

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", api);

app.get("/*", (req, res) => {
  res.send("Hello there!");
});

module.exports = app;
