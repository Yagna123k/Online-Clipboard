const Clipboard = require('../models/Clipboard');

exports.createOrAuthenticateClipboard = async (req, res) => {
    const { code, passcode, isPrivate } = req.body;

    try {
        let clipboard = await Clipboard.findOne({ code });

        if (!clipboard) {
            clipboard = new Clipboard({
                code,
                isPrivate: isPrivate || false,
                passcode: isPrivate ? passcode : null,
                items: []
            });

            await clipboard.save();
            return res.status(201).json({ message: "New clipboard created successfully" });
        }

        if (clipboard.isPrivate && !passcode) {
            return res.status(403).json({ error: "This is a private clipboard. Please enter a passcode." });
        }

        if (!clipboard.isPrivate && passcode) {
            return res.status(400).json({ error: "This is a public clipboard. No passcode required." });
        }

        if (clipboard.isPrivate && clipboard.passcode !== passcode) {
            return res.status(403).json({ error: "Incorrect passcode" });
        }

        res.json({ message: "Clipboard authenticated successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error processing clipboard request" });
    }
};

exports.addItem = async (req, res) => {
    try {
        const { code, item, passcode } = req.body;
        if (!code || !item) {
            return res.status(400).json({ error: "Code and item are required" });
        }

        const clipboard = await Clipboard.findOne({ code });
        if (!clipboard) {
            return res.status(404).json({ error: "Clipboard not found" });
        }

        // If private, check passcode
        if (clipboard.isPrivate && clipboard.passcode !== passcode) {
            return res.status(403).json({ error: "Incorrect passcode" });
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
    const { passcode } = req.body;

    try {
        const clipboard = await Clipboard.findOne({ code });

        if (!clipboard) {
            return res.status(404).json({ error: "Clipboard not found" });
        }

        if (clipboard.isPrivate) {
            if (!passcode) {
                return res.status(403).json({ error: "This is a private clipboard. Please enter a passcode." });
            }
            if (clipboard.passcode !== passcode) {
                return res.status(403).json({ error: "Incorrect passcode." });
            }
        }

        res.json({ items: clipboard.items });

    } catch (error) {
        console.error("Error retrieving clipboard items:", error);
        res.status(500).json({ error: "Error retrieving clipboard items." });
    }
};