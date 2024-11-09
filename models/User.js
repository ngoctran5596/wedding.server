const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Đảm bảo tên người dùng là duy nhất
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Tự động gán thời gian hiện tại khi tạo người dùng
  },
});

// Tạo model từ schema
const User = mongoose.model("User", userSchema);

module.exports = User;
