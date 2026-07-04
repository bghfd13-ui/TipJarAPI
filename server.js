const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT;

// ================= ROOT =================
app.get("/", (req, res) => {
    res.send("TipJar API online");
});

// ================= CLOTHING / ITEMS (ВАЖНО) =================
app.get("/catalog/items", async (req, res) => {
    try {
        const { creatorTargetId, category, limit } = req.query;

        const r = await axios.get(
            `https://www.pekora.zip/api/catalog/items?creatorType=User` +
            `&creatorTargetId=${creatorTargetId}` +
            `&category=${category}` +
            `&limit=${limit || 25}`
        );

        res.json(r.data);
    } catch (e) {
        res.json({ data: [] });
    }
});

// ================= GAMEPASSES =================
app.get("/games/v1/games/:gameId/game-passes", async (req, res) => {
    try {
        const r = await axios.get(
            `https://www.pekora.zip/api/games/v1/games/${req.params.gameId}/game-passes`
        );

        res.json(r.data);
    } catch (e) {
        res.json({ data: [] });
    }
});

// ================= PRODUCT INFO =================
app.get("/apisite/api/marketplace/productinfo", async (req, res) => {
    try {
        const r = await axios.get(
            `https://www.pekora.zip/api/marketplace/productinfo?assetId=${req.query.assetId}`
        );

        res.json(r.data);
    } catch (e) {
        res.json({});
    }
});

// ================= USERS =================
app.get("/apisite/api/users/v1/users/:userId", async (req, res) => {
    try {
        const r = await axios.get(
            `https://www.pekora.zip/api/users/v1/users/${req.params.userId}`
        );

        res.json(r.data);
    } catch (e) {
        res.json({});
    }
});

// ================= AVATAR =================
app.get("/apisite/thumbnails/v1/users/avatar", (req, res) => {
    const id = req.query.userIds;

    res.json({
        data: [{
            imageUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`
        }]
    });
});

// ================= START =================
app.listen(PORT, "0.0.0.0", () => {
    console.log("TipJar API running on", PORT);
});
