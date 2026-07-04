const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("TipJar API v2 running");
});


// ===============================
// HEALTH
// ===============================
app.get("/health", (req, res) => {
  res.json({ ok: true, status: "alive" });
});


// ===============================
// MARKETPLACE PRODUCT INFO
// ===============================
app.get("/api/marketplace/productinfo", async (req, res) => {
  const assetId = req.query.assetId;

  if (!assetId) {
    return res.status(400).json({ error: "missing assetId" });
  }

  try {
    const url = `https://www.pekora.zip/api/marketplace/productinfo?assetId=${assetId}`;

    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    return res.json(response.data);

  } catch (err) {
    console.log("productinfo error:", err.message);

    return res.json({
      AssetId: Number(assetId),
      Name: "Unknown",
      PriceInRobux: 0,
      AssetTypeId: 0,
      IsForSale: false
    });
  }
});


// ===============================
// CATALOG (CLOTHING / TSHIRTS)
// ===============================
app.get("/catalog/v1/search/items", async (req, res) => {
  const { creatorTargetId, category } = req.query;

  if (!creatorTargetId) {
    return res.status(400).json({ error: "missing creatorTargetId" });
  }

  try {
    const url = `https://www.pekora.zip/api/catalog/v1/search/items` +
      `?creatorType=User&creatorTargetId=${creatorTargetId}` +
      `&category=${category || "Clothing"}&limit=25`;

    const response = await axios.get(url, { timeout: 8000 });

    return res.json(response.data);

  } catch (err) {
    console.log("catalog error:", err.message);

    return res.json({ data: [] });
  }
});


// ===============================
// GAMEPASSES
// ===============================
app.get("/games/v1/games/:gameId/game-passes", async (req, res) => {
  const gameId = req.params.gameId;

  try {
    const url = `https://www.pekora.zip/api/games/v1/games/${gameId}/game-passes?limit=100`;

    const response = await axios.get(url, { timeout: 8000 });

    return res.json(response.data);

  } catch (err) {
    console.log("gamepasses error:", err.message);

    return res.json({ data: [] });
  }
});


// ===============================
// USERS (display name fallback)
// ===============================
app.get("/users/v1/users/:id", async (req, res) => {
  const id = req.params.id;

  return res.json({
    id,
    displayName: "Player",
    name: "Player"
  });
});


// ===============================
// START SERVER (IMPORTANT FOR RENDER)
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log("TipJar API running on port", PORT);
});
