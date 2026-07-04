const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.json({ ok: true, service: "TipJar API v2" });
});

// ================= GAMEPASSES =================
app.get("/gamepasses", async (req, res) => {
  try {
    const { gameId } = req.query;

    if (!gameId) return res.status(400).json({ error: "missing gameId" });

    const url = `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100&sortOrder=Asc`;

    const r = await axios.get(url);

    const data = (r.data?.data || []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price || 0,
      assetType: "Gamepass"
    }));

    res.json({ data });

  } catch (e) {
    console.error("gamepasses error:", e.message);
    res.status(500).json({ error: "gamepasses failed" });
  }
});

// ================= CATALOG (CLOTHING FIXED) =================
app.get("/catalog", async (req, res) => {
  try {
    const { userId, category } = req.query;

    if (!userId || !category) {
      return res.status(400).json({ error: "missing params" });
    }

    // FIXED Roblox endpoint (stable)
    const url = `https://catalog.roblox.com/v1/search/items/details`;

    const r = await axios.get(url, {
      params: {
        Category: category,
        CreatorTargetId: userId,
        CreatorType: "User",
        Limit: 30
      }
    });

    const items = (r.data?.data || []).map(i => ({
      id: i.id,
      name: i.name,
      price: i.price || 0,
      assetType: i.assetType || "Clothing",
      isForSale: true
    }));

    res.json({ data: items });

  } catch (e) {
    console.error("catalog error:", e.message);
    res.status(500).json({ error: "catalog failed" });
  }
});

// ================= PRODUCT INFO =================
app.get("/productinfo", async (req, res) => {
  try {
    const { assetId } = req.query;

    if (!assetId) return res.status(400).json({ error: "missing assetId" });

    const url = `https://economy.roblox.com/v2/assets/${assetId}/details`;

    const r = await axios.get(url);

    res.json({
      AssetId: assetId,
      Name: r.data?.Name,
      PriceInRobux: r.data?.PriceInRobux || 0,
      AssetTypeId: r.data?.AssetTypeId,
      IsForSale: r.data?.IsForSale
    });

  } catch (e) {
    console.error("productinfo error:", e.message);
    res.status(500).json({ error: "productinfo failed" });
  }
});

// ================= USER =================
app.get("/user", async (req, res) => {
  try {
    const { userId } = req.query;

    const r = await axios.get(`https://users.roblox.com/v1/users/${userId}`);

    res.json(r.data);

  } catch (e) {
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

  } catch (e) {
    res.status(500).json({ error: "avatar failed" });
  }
});

app.listen(PORT, () => {
  console.log("TipJar API v2 running on", PORT);
});
