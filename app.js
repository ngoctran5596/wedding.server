const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware"); // Nhập middleware
const bcrypt = require("bcrypt");
require("dotenv/config");
app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());

//routes
const categoryRoutes = require("./routes/category");
const User = require("./models/User");
app.use("/api/v1/category", categoryRoutes);

// Thêm route cho đăng nhập
app.post("/api/v1/login", async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem tên người dùng và mật khẩu có được cung cấp không
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  return res.json({ token });
});

// Thêm route cho đăng xuất
app.post("/api/v1/logout", (req, res) => {
  res.send("Logged out successfully");
});

app.get("/", (req, res) => {
  res.send("HELLO");
});

// Thêm route cho đăng ký
app.post("/api/v1/register", async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem người dùng đã tồn tại chưa
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // Lưu người dùng vào cơ sở dữ liệu
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).send("User registered successfully");
});

// Thêm route yêu cầu xác thực
app.get("/api/v1/protected", authMiddleware, (req, res) => {
  res.send(
    `Hello ${req.user.username}, you have access to this protected route.`
  );
});

//connect to DB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//listen to server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
