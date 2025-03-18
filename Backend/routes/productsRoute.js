const express = require('express');
const { requireSignIn, isAdmin } = require('../middleware/middleware');
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, productFiltersController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController } = require('../controllers/productsController');
const formidable = require('express-formidable');
const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)
router.get('/get-product', getProductController)

router.get('/get-product/:slug', getSingleProductController)

router.get("/product-photo/:pid", productPhotoController);

router.delete('/product/:pid', deleteProductController)

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);
//search product
router.get('/search/:keyword', searchProductController)

router.get('/related-product/:pid/:cid', relatedProductController)
router.get('/product-category/:slug', productCategoryController)

module.exports = router