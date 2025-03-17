const { default: slugify } = require("slugify");
const categoriesModel = require("../models/categoriesModel");

const createCategories = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: 'Hãy nhập tên' });
        }
        const existingCategory = await categoriesModel.findOne({ name });
        if (existingCategory) {
            return res.status(201).send({
                success: true,
                message: 'Category đã tồn tại'
            })
        }
        const category = await new categoriesModel({ name, slug: slugify(name) }).save();
        res.status(200).json({
            success: true,
            message: 'Tạo category thành công',
            Category: category
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hàm createCategories'
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoriesModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        )
        res.status(200).send({
            success: true,
            message: 'Cập nhật category thành công',
            category
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hàm updateCategory'
        })
    }
}

module.exports = {
    createCategories,
    updateCategory
}