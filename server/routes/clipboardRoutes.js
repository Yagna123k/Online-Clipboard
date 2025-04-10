const express = require('express');
const { createOrAuthenticateClipboard, addItem, getClipboardItems, deleteItem  } = require('../controllers/clipboardController');
const router = express.Router();

router.post('/go', createOrAuthenticateClipboard);
router.post('/add-item', addItem);
router.post('/:code', getClipboardItems);
router.delete('/delete-item', deleteItem);
module.exports = router;
