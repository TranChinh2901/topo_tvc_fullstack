const express = require('express');
const { requireSignIn, isAdmin } = require('../middleware/middleware');
const {
    createCategories,
    updateCategory,
    getALlCategories,
    getSingleCategory,
    deleteCategoryController
} = require('../controllers/categoriesController');
const router = express.Router();


router.post('/create-category', requireSignIn, isAdmin, createCategories);
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategory);
router.get('/all-categories', getALlCategories)
router.get('/single-category/:slug', getSingleCategory)
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

module.exports = router