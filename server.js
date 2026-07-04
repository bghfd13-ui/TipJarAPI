const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.json({ ok: true, status: "TipJar API running" });
});

// ======================
// PRODUCT INFO (proxy)
// ======================
app.get("/productinfo", async (req, res) => {
  try {
    const { assetId } = req.query;

    const url = `https://www.roblox.com/api/catalog/v1/catalog/items/details?itemIds=${assetId}`;

    const r = await axios.get(url);
    const item = r.data?.data?.[0];

    if (!item) return res.status(404).json({ error: "not found" });

    res.json({
      AssetId: item.id,
      Name: item.name,
      PriceInRobux: item.price,
      AssetTypeId: item.assetType,
      IsForSale: item.isForSale
    });

  } catch (e) {
    console.error("productinfo error:", e.message);
    res.status(500).json({ error: "productinfo failed" });
  }
});

// ======================
// CATALOG (clothing)
// ======================
app.get("/catalog", async (req, res) => {
  try {
    const { userId, category } = req.query;

    const url = `https://catalog.roblox.com/v1/search/items/details?Category=${category}&CreatorTargetId=${userId}&CreatorType=User&Limit=25`;

    const r = await axios.get(url);

    res.json({ data: r.data?.data || [] });

  } catch (e) {
    console.error("catalog error:", e.message);
    res.status(500).json({ error: "catalog failed" });
  }
});

// ======================
// GAMEPASSES
// ======================
app.get("/gamepasses", async (req, res) => {
  try {
    const { gameId } = req.query;

    const url = `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100&sortOrder=Asc`;

    const r = await axios.get(url);

    res.json({ data: r.data?.data || [] });

  } catch (e) {
    console.error("gamepasses error:", e.message);
    res.status(500).json({ error: "gamepasses failed" });
  }
});

// ======================
// USER INFO
// ======================
app.get("/user", async (req, res) => {
  try {
    const { userId } = req.query;

    const url = `https://users.roblox.com/v1/users/${userId}`;

    const r = await axios.get(url);

    res.json(r.data);

  } catch (e) {
    res.status(500).json({ error: "user failed" });
  }
});

// ======================
// AVATAR THUMBNAIL
// ======================
app.get("/avatar", async (req, res) => {
  try {
    const { userId } = req.query;

    const url = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png`;

    const r = await axios.get(url);

    res.json({
      imageUrl: r.data?.data?.[0]?.imageUrl
    });

  } catch (e) {
    res.status(500).json({ error: "avatar failed" });
  }
});

// ======================
app.listen(PORT, () => {
  console.log("API running on port", PORT);
});
