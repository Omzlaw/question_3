require("dotenv").config();
const PORT = process.env.PORT;

const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const SERVER_PORT = PORT || 8000;
const startServer = async () => {
  server.listen(SERVER_PORT, () => {
    console.log("Server is listening on port: " + SERVER_PORT);
  });
};

startServer();