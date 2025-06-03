import User from "../models/User.js";

// Middleware kiểm tra quyền admin
export const isAdmin = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(401).json({
        error: true,
        message: "Vui lòng cung cấp username",
      });
    }

    const user = await User.findOne({ where: { Username: username } });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy người dùng",
      });
    }

    if (user.Status === "Đã nghỉ việc") {
      return res.status(403).json({
        error: true,
        message: "Tài khoản đã bị vô hiệu hóa",
      });
    }

    // Lưu thông tin user vào request để sử dụng ở các middleware tiếp theo
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi xác thực",
    });
  }
};
