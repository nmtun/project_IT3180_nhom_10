// import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import sequelize from "./src/config/dbsetup.js";

// // Model
// import User from "./src/models/User.js";
// import Household from "./src/models/Household.js";
// import Vehicle from "./src/models/Vehicle.js";
// import FeeCollection from "./src/models/FeeCollection.js";
// import FeeDetail from "./src/models/FeeDetail.js";
// import FeeType from "./src/models/FeeType.js";
// import Resident from "./src/models/Resident.js";

// // import routes
// import UserRoutes from "./src/routes/UserRoutes.js";
// import HouseholdRoutes from "./src/routes/HouseholdRoutes.js";
// import ResidentRoutes from "./src/routes/ResidentRoutes.js";
// import FeeTypeRoutes from "./src/routes/FeeTypeRoutes.js";
// import FeeDetailRoutes from "./src/routes/FeeDetailRoutes.js";
// import FeeCollectionRoutes from "./src/routes/FeeCollectionRoutes.js";
// import VehicleRoutes from "./src/routes/VehicleRoutes.js";  

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Accepct all origins
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// // Middleware
// app.use(cors());
// app.use(express.json()); 
// app.use(helmet());
// app.use(morgan("dev"));

// // Test route
// app.get("/", (req, res) => {
//   res.json({ data: "API is running..." });
// });

// // Routes 
// app.use("/api/users", UserRoutes);
// app.use("/api/households", HouseholdRoutes);
// app.use("/api/residents", ResidentRoutes);
// app.use("/api/fee-type", FeeTypeRoutes);
// app.use("/api/fee-detail", FeeDetailRoutes);
// app.use("/api/fee-collection", FeeCollectionRoutes);
// app.use("/api/vehicle", VehicleRoutes);

// // Tạo bảng và chạy server
// (async () => {
//   try {
//     // await sequelize.sync(); // tạo bảng nếu chưa có
//     // await sequelize.sync({ alter: true }); // tự động cập nhật bảng nếu có thay đổi trong model
//     // await sequelize.sync({ force: true }); // xóa bảng và tạo lại - dùng khi cần làm mới cơ sở dữ liệu, sẽ bị mất dữ liệu
    
//     app.listen(PORT, () => {
//       console.log(`Server is running at http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Lỗi khởi động server:", error);
//   }
// })();

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
import FeeCollection from "./src/models/FeeCollection.js";
import FeeDetail from "./src/models/FeeDetail.js";
import FeeType from "./src/models/FeeType.js";
import Resident from "./src/models/Resident.js";

// import routes
import UserRoutes from "./src/routes/UserRoutes.js";
import HouseholdRoutes from "./src/routes/HouseholdRoutes.js";
import ResidentRoutes from "./src/routes/ResidentRoutes.js";
import FeeTypeRoutes from "./src/routes/FeeTypeRoutes.js";
import FeeDetailRoutes from "./src/routes/FeeDetailRoutes.js";
import FeeCollectionRoutes from "./src/routes/FeeCollectionRoutes.js";
import VehicleRoutes from "./src/routes/VehicleRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép requests không có origin (như mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      /^https:\/\/.*\.ngrok-free\.app$/,
    ];

    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  credentials: false,
  maxAge: 86400, // 24 giờ
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Áp dụng CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({ data: "API is running..." });
});

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/households", HouseholdRoutes);
app.use("/api/residents", ResidentRoutes);
app.use("/api/fee-type", FeeTypeRoutes);
app.use("/api/fee-detail", FeeDetailRoutes);
app.use("/api/fee-collection", FeeCollectionRoutes);
app.use("/api/vehicle", VehicleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

// Tạo bảng và chạy server
(async () => {
  try {
    // await sequelize.sync(); // tạo bảng nếu chưa có
    // await sequelize.sync({ alter: true }); // tự động cập nhật bảng nếu có thay đổi trong model
    // await sequelize.sync({ force: true }); // xóa bảng và tạo lại - dùng khi cần làm mới cơ sở dữ liệu, sẽ bị mất dữ liệu

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("CORS is configured with options:", corsOptions);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
  }
})();