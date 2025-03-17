const express = require('express');
const { requireSignIn, isAdmin } = require('../middleware/middleware');
const { createProductController } = require('../controllers/productsController');
const formidable = require('express-formidable');
const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)


module.exports = router