const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.send("TipJar API v2 running");
});


// ============================
// 1. GAMEPASSES (как у тебя было)
// ============================
app.get("/passes/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const response = await axios.get(
            `https://www.pekora.zip/api/catalog/items?category=0&limit=100&sortType=0&creatorTargetId=${userId}`
        );

        let passes = [];

        for (const item of response.data.data || []) {
            if (item.assetType == 34) {
                passes.push({
                    id: item.id,
                    name: item.name,
                    price: item.price
                });
            }
        }

        res.json(passes);

    } catch (err) {
        console.log("passes error:", err.message);
        res.json([]);
    }
});


// ============================
// 2. MARKETPLACE PRODUCT INFO (ВАЖНО)
// ============================
app.get("/api/marketplace/productinfo", async (req, res) => {
    const assetId = req.query.assetId;

    if (!assetId) return res.status(400).json({ error: "missing assetId" });

    try {
        const response = await axios.get(
            `https://www.pekora.zip/apisite/api/marketplace/productinfo?assetId=${assetId}`
        );

        res.json(response.data);

    } catch (err) {
        console.log("productinfo error:", err.message);
        res.status(500).json({});
    }
});


// ============================
// 3. CATALOG SEARCH (ОЧЕНЬ ВАЖНО)
// ============================
app.get("/catalog/v1/search/items", async (req, res) => {
    try {
        const { creatorType, creatorTargetId, category, limit } = req.query;

        const url =
            `https://www.pekora.zip/apisite/catalog/v1/search/items` +
            `?creatorType=${creatorType}&creatorTargetId=${creatorTargetId}` +
            `&category=${category}&limit=${limit}`;

        const response = await axios.get(url);

        res.json(response.data);

    } catch (err) {
        console.log("catalog error:", err.message);
        res.status(500).json({ data: [] });
    }
});


// ============================
// 4. GAMEPASSES LIST (игры)
// ============================
app.get("/games/v1/games/:gameId/game-passes", async (req, res) => {
    const gameId = req.params.gameId;

    try {
        const response = await axios.get(
            `https://www.pekora.zip/apisite/games/v1/games/${gameId}/game-passes?limit=100&sortOrder=Asc`
        );

        res.json(response.data);

    } catch (err) {
        console.log("gamepasses error:", err.message);
        res.status(500).json({ data: [] });
    }
});


// ============================
// 5. AVATAR THUMBNAIL
// ============================
app.get("/thumbnails/v1/users/avatar", async (req, res) => {
    const userIds = req.query.userIds;

    try {
        const response = await axios.get(
            `https://www.pekora.zip/apisite/thumbnails/v1/users/avatar?userIds=${userIds}&size=420x420&format=png`
        );

        res.json(response.data);

    } catch (err) {
        console.log("avatar error:", err.message);

        // fallback (чтобы не ломалось)
        res.json({
            data: [{
                imageUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${userIds}&width=150&height=150&format=png`
            }]
        });
    }
});


// ============================
app.listen(PORT, () => {
    console.log("TipJar API v2 running on port", PORT);
});
