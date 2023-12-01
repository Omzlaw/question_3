const express = require("express");
// Routers
const redisRouter = require("./redis/redis.router");

const api = express.Router();

// Use Routers
api.use("/redis", redisRouter);

module.exports = api;
