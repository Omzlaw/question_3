const { Router } = require("express");
const client = require("../../redis");

const redisRouter = Router();

// Route to store product listings
redisRouter.post("/products", (req, res) => {
  const { productId, productName } = req.body;

  client.setEx(`product:${productId}`, 3600, productName, (err, reply) => {
    // Expire after 1 hour (3600 seconds)
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(201).send("Product stored successfully");
    }
  });
});

// Route to retrieve product listings
redisRouter.get("/products/:productId", (req, res) => {
  const productId = req.params.productId;

  // Retrieve product information from Redis
  client.get("products", productId, (err, reply) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (reply) {
      res.status(200).json({ productId, productName: reply });
    } else {
      res.status(404).send("Product not found");
    }
  });
});

// Route to store user search history
redisRouter.post("/search-history/:userId", (req, res) => {
  const { userId } = req.params;
  const { searchTerm } = req.body;

  // Add search term to user's search history in Redis
  client
    .multi()
    .lPush(`searchHistory:${userId}`, searchTerm)
    .expire(`searchHistory:${userId}`, 604800)
    .exec((err, replies) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(201).send("Search history stored successfully");
      }
    });
});

// Route to retrieve user search history
redisRouter.get("/search-history/:userId", (req, res) => {
  const { userId } = req.params;

  // Retrieve user's search history from Redis
  client.lRange(`searchHistory:${userId}`, 0, -1, (err, reply) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({ userId, searchHistory: reply });
    }
  });
});

// Invalidation mechanism: Product cache
redisRouter.delete("/products/:productId", (req, res) => {
  const { productId } = req.params;

  // Invalidate product cache in Redis
  client.hDel("products", productId, (err, reply) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (reply === 1) {
      res.status(200).send("Product cache invalidated successfully");
    } else {
      res.status(404).send("Product not found");
    }
  });
});

// Invalidation mechanism: Search History cache
redisRouter.delete("/search-history/:userId", (req, res) => {
  const { userId } = req.params;

  // Invalidate product cache in Redis
  client.hDel("searchHistory", userId, (err, reply) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (reply === 1) {
      res.status(200).send("Search History cache invalidated successfully");
    } else {
      res.status(404).send("Search History not found");
    }
  });
});

module.exports = redisRouter;
