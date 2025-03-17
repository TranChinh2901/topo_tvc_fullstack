const express = require('express');
const { requireSignIn, isAdmin } = require('../middleware/middleware');
const {
    createCategories,
    updateCategory
} = require('../controllers/categoriesController');
const router = express.Router();


router.post('/create-category', requireSignIn, isAdmin, createCategories);
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategory);

module.exports = router