import * as userService from "../services/UserServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
// lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

// lấy người dùng theo id
export const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// thêm người dùng mới
export const createUser = async (req, res) => {
  try {
    const { Username, Password, FullName, Email, PhoneNumber, Role } = req.body;

    if (!Username) return res.status(400).json({ message: "Username is required" });
    if (!Password) return res.status(400).json({ message: "Password is required" });
    if (!FullName) return res.status(400).json({ message: "Full name is required" });
    if (!Email) return res.status(400).json({ message: "Email is required" });
    if (!PhoneNumber) return res.status(400).json({ message: "Phone number is required" });
    if (!Role) return res.status(400).json({ message: "Role is required" });

    // băm mật khẩu 
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    
    // gửi thông tin về service
    const newUser = await userService.createUser({
      Username,
      Password: hashedPassword,
      FullName,
      Email,
      PhoneNumber,
      Role,
    });
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
  
// cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.json(updatedUser);
};

// xóa
export const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  if (!result) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
};


// đăng nhập
export const login = async (req, res) => {
  try{
    const {Username, Password} = req.body;
    if(!Username) return res.status(400).json({ message: "Username is required" });
    if(!Password) return res.status(400).json({ message: "Password is required" });

    const user = await userService.findUserByUsername(Username);
    if(!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.status(200).json({ message: "Login successful", token });

  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
};