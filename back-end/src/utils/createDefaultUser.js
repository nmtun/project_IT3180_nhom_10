import bcrypt from "bcrypt";
import { defaultUser } from "../config/defaultUser.js";
import User from "../models/User.js";

export const createDefaultUser = async () => {
  try {
    // Kiểm tra xem người dùng admin đã tồn tại chưa
    const existingUser = await User.findOne({
      where: { Username: defaultUser.Username },
    });

    if (!existingUser) {
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(defaultUser.Password, 10);

      // Tạo người dùng mới
      await User.create({
        ...defaultUser,
        Password: hashedPassword,
      });

      console.log("Default admin user created successfully");
    } else {
      console.log("Default admin user already exists");
    }
  } catch (error) {
    console.error("Error creating default user:", error);
  }
};
