const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({ ok: true, service: "Donate API v3" });
});

// ================= GAMEPASSES =================
app.get("/gamepasses", async (req, res) => {
  try {
    const { gameId } = req.query;
    if (!gameId) return res.status(400).json({ error: "missing gameId" });

    const r = await axios.get(
      `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100&sortOrder=Asc`
    );

    res.json({
      data: (r.data?.data || []).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price || 0,
        assetType: "Gamepass"
      }))
    });

  } catch (e) {
    res.status(500).json({ error: "gamepasses failed" });
  }
});

// ================= CATALOG =================
app.get("/catalog", async (req, res) => {
  try {
    const { userId, category } = req.query;
    if (!userId || !category) {
      return res.status(400).json({ error: "missing params" });
    }

    const r = await axios.get(
      `https://catalog.roblox.com/v1/search/items/details`,
      {
        params: {
          CreatorTargetId: userId,
          CreatorType: "User",
          Limit: 30,
          Category: category
        }
      }
    );

    res.json({
      data: (r.data?.data || []).map(i => ({
        id: i.id,
        name: i.name,
        price: i.price || 0,
        assetType: i.assetType || "Clothing",
        isForSale: true
      }))
    });

  } catch (e) {
    res.status(500).json({ error: "catalog failed" });
  }
});

// ================= PRODUCT INFO =================
app.get("/productinfo", async (req, res) => {
  try {
    const { assetId } = req.query;
    if (!assetId) return res.status(400).json({ error: "missing assetId" });

    const r = await axios.get(
      `https://economy.roblox.com/v2/assets/${assetId}/details`
    );

    res.json({
      AssetId: assetId,
      Name: r.data?.Name,
      PriceInRobux: r.data?.PriceInRobux || 0,
      AssetTypeId: r.data?.AssetTypeId,
      IsForSale: r.data?.IsForSale
    });

  } catch (e) {
    res.status(500).json({ error: "productinfo failed" });
  }
});

// ================= USER =================
app.get("/user", async (req, res) => {
  try {
    const { userId } = req.query;

    const r = await axios.get(
      `https://users.roblox.com/v1/users/${userId}`
    );

    res.json(r.data);

  } catch {
    res.status(500).json({ error: "user failed" });
  }
});

// ================= AVATAR =================
app.get("/avatar", async (req, res) => {
  try {
    const { userId } = req.query;

    const r = await axios.get(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png`
    );

    res.json({
      imageUrl: r.data?.data?.[0]?.imageUrl
    });

  } catch {
    res.status(500).json({ error: "avatar failed" });
  }
});

app.listen(PORT, () => {
  console.log("Donate API v3 running on", PORT);
});
