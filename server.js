const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ================= ROOT =================
app.get("/", (req, res) => {
    res.send("TipJar API (legacy compatible) online");
});


// ================= PRODUCT INFO =================
app.get("/api/marketplace/productinfo", async (req, res) => {
    try {
        const assetId = req.query.assetId;

        const response = await axios.get(
            `https://www.pekora.zip/api/marketplace/productinfo?assetId=${assetId}`
        );

        res.json(response.data);
    } catch (e) {
        res.status(500).json({});
    }
});


// ================= CATALOG ITEMS =================
app.get("/api/catalog/v1/search/items", async (req, res) => {
    try {
        const { creatorTargetId, category, limit } = req.query;

        const url =
            `https://www.pekora.zip/api/catalog/items` +
            `?creatorType=User&creatorTargetId=${creatorTargetId}` +
            `&category=${category || "Clothing"}` +
            `&limit=${limit || 25}`;

        const response = await axios.get(url);

        res.json(response.data);
    } catch (e) {
        res.json({ data: [] });
    }
});


// ================= GAMEPASSES =================
app.get("/api/games/v1/games/:gameId/game-passes", async (req, res) => {
    try {
        const { gameId } = req.params;

        const response = await axios.get(
            `https://www.pekora.zip/api/games/v1/games/${gameId}/game-passes?limit=100`
        );

        res.json(response.data);
    } catch (e) {
        res.json({ data: [] });
    }
});


// ================= USERS =================
app.get("/api/users/v1/users/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const response = await axios.get(
            `https://www.pekora.zip/api/users/v1/users/${userId}`
        );

        res.json(response.data);
    } catch (e) {
        res.json({});
    }
});


// ================= AVATAR =================
app.get("/api/thumbnails/v1/users/avatar", (req, res) => {
    const userIds = req.query.userIds;

    const url =
        `https://www.roblox.com/headshot-thumbnail/image?userId=${userIds}` +
        `&width=420&height=420&format=png`;

    res.json({
        data: [
            {
                imageUrl: url
            }
        ]
    });
});


// ================= START =================
app.listen(PORT, () => {
    console.log("Legacy TipJar API running on port", PORT);
});
