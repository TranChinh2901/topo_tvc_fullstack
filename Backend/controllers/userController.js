const { hashPassword, comparePassword } = require("../helper/userHelper");
const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");


const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, gender } = req.body;
        if (!name) {
            return res.send({ error: 'Hãy nhập tên' })
        }
        if (!email) {
            return res.send({ error: 'Hãy nhập email' })
        }
        if (!password) {
            return res.send({ error: 'Hãy nhập mật khẩu' })
        }
        if (!phone) {
            return res.send({ error: 'Hãy nhập sdt' })
        }
        if (!address) {
            return res.send({ error: 'Hãy nhập địa chỉ' })
        }
        if (!gender) {
            return res.send({ error: 'Hãy nhập giới tính' })
        }
        //Kiểm tra tk có tồn tại hay chưa
        const userExists = await userModel.findOne({ email })
        if (userExists) {
            return res.status(200).send({
                success: false,
                message: 'Tài khoản đã tồn tại, vui lòng đăng nhập'
            })
        }
        //Tạo mới
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            gender
        }).save();
        res.status(201).send({
            success: true,
            message: 'Đăng kí thành công',
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng kí',
            error: error.message
        })
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Tài khoản hoặc mật khẩu không hợp lệ'
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email chưa được đăng kí'
            })
        }

        const soSanh = await comparePassword(password, user.password)
        if (!soSanh) {
            return res.status(401).send({
                success: false,
                message: 'Mật khẩu không đúng'
            })
        }

        //Kiểm tra token(token sẽ hết hạn sau 7 ngày)
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: 'Đăng nhập thành công',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                gender: user.gender,
                role: user.role

            },
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi login',
            error: error.message
        })
    }
}

// Hiển thị tất cả người dùng
const getAllUsers = async (req, res) => {
    try {
        const getUsers = await userModel.find();
        if (!getUsers || getUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng',
            })
        }
        res.status(200).json({ getUsers })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hàm getAllUsers'
        })
    }
}

//Hiển thị người dùng theo id
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await userModel.findById(id);
        if (!userExist) {
            return res.status(404).send({
                success: false,
                message: 'Không tìm thấy id người dùng'
            })
        }
        res.status(200).send({
            userExist
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hàm getUserById'
        })
    }
}

//Xóa người dùng
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const xoaUser = await userModel.findByIdAndDelete(id);
        if (!xoaUser) {
            return res.status(404).send({
                success: false,
                message: 'Không thể xoas người dùng'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công',
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi hàm deleteUser'
        })
    }
}
//update user
const updateUserController = async (req, res) => {
    try {
        const id = req.params.id
        const userExist = await userModel.findById(id)
        if (!userExist) {
            return res.status(404).json({
                massage: 'KHông thể update '
            })
        }
        const updateUser = await userModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.status(200).json({ updateUser })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Lỗi hàm updateUserController'
        })
    }
}
//Đếm số lượng user
const countUser = async (req, res) => {
    try {
        const usersCount = await userModel.countDocuments();
        res.status(200).send({
            User: usersCount,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Lỗi không thể đếm số lượng users'
        })
    }
}

const logoutController = async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: 'Đăng xuất thành công',
            token: null
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng xuất',
            error: error.message
        });
    }
};

module.exports = {
    registerController,
    loginController,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserController,
    countUser,
    logoutController
}