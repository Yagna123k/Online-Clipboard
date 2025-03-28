const Clipboard = require('../models/Clipboard');

exports.createOrAuthenticateClipboard = async (req, res) => {
    const { code } = req.body;
    try {
        let clipboard = await Clipboard.findOne({ code });

        if (!clipboard) {
            clipboard = new Clipboard({ code, items: [] });
            await clipboard.save();
            return res.status(201).json({ message: "New clipboard created successfully" });
        }

        res.json({ message: "Clipboard authenticated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error processing clipboard request" });
    }
};

exports.addItem = async (req, res) => {
    try {
        const { code, item } = req.body;
        if (!code || !item) {
            return res.status(400).json({ error: "Code and item are required" });
        }

        const clipboard = await Clipboard.findOne({ code });
        if (!clipboard) {
            return res.status(404).json({ error: "Clipboard not found" });
        }

        clipboard.items.push(item);
        await clipboard.save();

        res.status(201).json({ message: "Item added successfully", items: clipboard.items });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getClipboardItems = async (req, res) => {
    const { code } = req.params;
    try {
        const clipboard = await Clipboard.findOne({ code });

        if (!clipboard) {
            return res.status(404).json({ error: "Clipboard not found" });
        }

        res.json({ items: clipboard.items });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving clipboard items" });
    }
};
