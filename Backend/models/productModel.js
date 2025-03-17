const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        priceGoc: { type: Number, required: true, min: 0 },
        category: { type: mongoose.ObjectId, ref: "Category", required: true },
        quantity: { type: Number, required: true },
        photo: { data: Buffer, contentType: String },
        detailImage: { type: String },
        discount: { type: Number, min: 0, max: 100 },
        rating: { type: Number, min: 0, max: 5 },
        shipping: { type: Boolean },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
