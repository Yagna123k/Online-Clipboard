const mongoose = require('mongoose');

const clipboardSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    isPrivate: { type: Boolean, default: false }, 
    passcode: { type: String, required: function() { return this.isPrivate; } }, 
    items: [{ type: Object }]
});

module.exports = mongoose.model('Clipboard', clipboardSchema);
