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

module.exports = {
    createProductController
};
