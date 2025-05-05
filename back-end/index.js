// index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import sequelize from "./src/config/dbsetup.js";

// Model
import User from "./src/models/User.js";

//routes
import UserRoutes from "./src/routes/UserRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({ data: "API is running..." });
});

// Route
app.use("/api/users", UserRoutes);

// Tạo bảng và chạy server
(async () => {
  try {
    await sequelize.sync(); // tạo bảng nếu chưa có
    
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
  }
})();

