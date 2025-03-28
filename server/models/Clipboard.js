const mongoose = require('mongoose');

const clipboardSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    items: [{ type: Object }]
});

module.exports = mongoose.model('Clipboard', clipboardSchema);