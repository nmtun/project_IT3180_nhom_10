import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import sequelize from "./src/config/dbsetup.js";

// Model
import User from "./src/models/User.js";
import Household from "./src/models/Household.js";
import Vehicle from "./src/models/Vehicle.js";
import FeeCollection from "./src/models/FeeColection.js";
import FeeDetail from "./src/models/FeeDetail.js";
import FeeType from "./src/models/FeeType.js";
import Resident from "./src/models/Resident.js";
import Change from "./src/models/Change.js";

// routes
import UserRoutes from "./src/routes/UserRoutes.js";
import HouseholdRoutes from "./src/routes/HouseholdRoutes.js";

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
app.use("/api/households", HouseholdRoutes);

// Tạo bảng và chạy server
(async () => {
  try {
    await sequelize.sync(); // tạo bảng nếu chưa có
    //await sequelize.sync({ force: true }); // xóa bảng và tạo lại - dùng khi cần làm mới cơ sở dữ liệu, sẽ bị mất dữ liệu
    
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
  }
})();

