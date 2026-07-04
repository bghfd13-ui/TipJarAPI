const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("TipJar API v2 online");
});


// ===== GAMEPASSES =====
app.get("/gamepasses/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const response = await axios.get(
            `https://www.pekora.zip/api/games/v1/users/${userId}/game-passes`
        );

        const passes = (response.data.data || []).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price || 0
        }));

        res.json(passes);
    } catch (e) {
        console.log(e.message);
        res.json([]);
    }
});


// ===== ITEMS (CLOTHING) =====
app.get("/items/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const response = await axios.get(
            `https://www.pekora.zip/api/catalog/items?creatorTargetId=${userId}&limit=50`
        );

        const items = (response.data.data || []).map(item => ({
            id: item.id,
            name: item.name,
            price: item.price || 0,
            assetType: item.assetType
        }));

        res.json(items);
    } catch (e) {
        console.log(e.message);
        res.json([]);
    }
});


// ===== PRODUCT INFO =====
app.get("/product/:assetId", async (req, res) => {
    try {
        const { assetId } = req.params;

        const response = await axios.get(
            `https://www.pekora.zip/api/marketplace/productinfo?assetId=${assetId}`
        );

        res.json(response.data);
    } catch (e) {
        console.log(e.message);
        res.json({});
    }
});


// ===== AVATAR =====
app.get("/avatar/:userId", async (req, res) => {
    const url = `https://www.roblox.com/headshot-thumbnail/image?userId=${req.params.userId}&width=420&height=420&format=png`;
    res.json({ url });
});


app.listen(PORT, () => {
    console.log("TipJar API v2 running on port", PORT);
});
