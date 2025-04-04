const express = require('express');
const { createOrAuthenticateClipboard, addItem, getClipboardItems } = require('../controllers/clipboardController');
const router = express.Router();

router.post('/go', createOrAuthenticateClipboard);
router.post('/add-item', addItem);
router.post('/:code', getClipboardItems);

module.exports = router;
