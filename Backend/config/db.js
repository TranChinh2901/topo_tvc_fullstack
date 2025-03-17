const mongoose = require('mongoose')

const connectDB = async (req, res) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Kết nối  mongodb thành công ${conn.connection.host}`);
    } catch (error) {
        console.log(`Lỗi khi connect mongodb ${error}`);

    }
}

module.exports = connectDB