const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');


const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized: Không có token'
            })
        }
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();

    } catch (error) {
        return res.status(500).json({
            message: 'Unauthorized: Không hợp lệ',
            error: error.message
        })
    }
}

// const isAdmin = async (req, res, next) => {
//     try {
//         const user = await userModel.findById(req.user._id);
//         if (!user) {
//             return res.status(404).json({
//                 message: 'Không tìm thấy người dùng'
//             })
//         }
//         if (user.role !== 1) {
//             return res.status(403).json({
//                 message: 'Truy cập bị từ chối, chỉ dành cho admin'
//             })
//         }
//         next();
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Lỗi trong admin middleware',
//             error: error.message
//         });
//     }
// }

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).json({
                message: 'Bạn chưa đăng nhập'
            });
        }

        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: 'Người dùng không tồn tại'
            });
        }

        if (user.status === "banned") {
            return res.status(403).json({
                message: 'Tài khoản của bạn đã bị khóa'
            });
        }

        if (user.role !== 1) {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi trong middleware kiểm tra admin',
            error: error.message
        });
    }
};
module.exports = {
    requireSignIn,
    isAdmin
}