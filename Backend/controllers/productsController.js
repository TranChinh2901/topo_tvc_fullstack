const productModel = require("../models/productModel");
const slugify = require("slugify");
const fs = require("fs");

const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, priceGoc, category, quantity, discount, rating, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Hẫy nhập tên" });
            case !description:
                return res.status(500).send({ error: "Hãy nhập chi tiết" });
            case !price:
                return res.status(500).send({ error: "Hãy nhập giá" });
            case !priceGoc:
                return res.status(500).send({ error: "Hãy nhập giá gốc" });
            case !category:
                return res.status(500).send({ error: "Hãy nhập category" });
            case !quantity:
                return res.status(500).send({ error: "Hãy nhập số lượng " });
            case discount < 0 || discount > 100:
                return res.status(500).send({ error: "Hãy nhập giảm giá" });
            case rating < 0 || rating > 5:
                return res.status(500).send({ error: "Hãy nhập đánh giá" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Hãy thêm ảnh" });
        }

        const products = new productModel({
            ...req.fields,
            slug: slugify(name) + "-" + Date.now(),
        });

        if (photo && photo.path) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product",
        });
    }
};

const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "All products",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting product",
            error: error.message,
        });
    }
};


const getSingleProductController = async (req, res) => {
    try {
        console.log("Slug received:", req.params.slug);
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting single product",
            error: error.message
        })
    }
}


const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting photo",
            error,
        });
    }
};


const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        })
    }
}

const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, priceGoc, category, quantity, discount, rating, shipping } = req.fields;
        const { photo } = req.files;
        //Validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Hẫy nhập tên" });
            case !description:
                return res.status(500).send({ error: "Hãy nhập chi tiết" });
            case !price:
                return res.status(500).send({ error: "Hãy nhập giá" });
            case !priceGoc:
                return res.status(500).send({ error: "Hãy nhập giá gốc" });
            case !category:
                return res.status(500).send({ error: "Hãy nhập category" });
            case !quantity:
                return res.status(500).send({ error: "Hãy nhập số lượng " });
            case discount < 0 || discount > 100:
                return res.status(500).send({ error: "Hãy nhập giảm giá" });
            case rating < 0 || rating > 5:
                return res.status(500).send({ error: "Hãy nhập đánh giá" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Hãy thêm ảnh" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Update product",
        });
    }
};

// filters
const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};

        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Filtering Products",
            error,
        });
    }
};

// product count
const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in product count",
            error,
            success: false,
        });
    }
};
//******************************************************************************************************************** */
// product list controller 
//Muốn thay đổi số lượng ảnh hiển thị trên ALL products thì chỉnh lại số lượng ở đây const perPage = 4;
const productListController = async (req, res) => {
    try {
        const perPage = 4;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
};

const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in search "
        })
    }
}

const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }

        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while getting related product",
            error,
        })
    }
}


const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: 'error while getting products'
        })
    }
}

module.exports = {
    createProductController,
    getProductController,
    getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController
}