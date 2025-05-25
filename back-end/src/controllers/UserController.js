import * as userService from "../services/UserServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
// lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({error: false, users});
};

// lấy người dùng theo id
export const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: true, message: "User not found" });
  res.json({error: false, user});
};

// thêm người dùng mới
export const createUser = async (req, res) => {
  try {
    const { Username, Password, FullName, Email, PhoneNumber, Role } = req.body;

    if (!Username) return res.status(400).json({ error: true, message: "Username is required" });
    if (!Password) return res.status(400).json({ error: true, message: "Password is required" });
    if (!FullName) return res.status(400).json({ error: true, message: "FullName is required" });
    if (!Email) return res.status(400).json({ error: true, message: "Email is required" });
    if (!PhoneNumber) return res.status(400).json({ error: true, message: "PhoneNumber is required" });
    if (!Role) return res.status(400).json({ error: true, message: "Role is required" });
    
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
    return res.status(201).json({ error: false, newUser });
  } catch (err) {
    return res.status(500).json({ error: true, message: "Internal server error"});
  }
};
  
// cập nhật thông tin, tài khoản ban quản lý
export const updateUser = async (req, res) => {
  // const updatedUser = await userService.updateUser(req.params.id, req.body);
  // if (!updatedUser) return res.status(404).json({ error: true, message: "User not found" });
  // res.json({error: false, updatedUser});
  try {
    const data = {...req.body};

    if(data.Password){
      const saltRounds = 10;
      data.Password = await bcrypt.hash(data.Password, saltRounds);
    }

    const updateUser = await userService.updateUser(req.params.id, data);

    if(!updateUser) return res.status(404).json({error: true, message: "User not found"});

    return res.status(200).json({error: false, updateUser, message: "Updated successfully"});
  } catch (err) {
    return res.status(500).json({error: true, message: "Inernal server error"});
  }
};

// xóa
export const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  if (!result) return res.status(404).json({ error: true, message: "User not found" });
  res.json({ error: false, message: "User deleted successfully" });
};
 
// đăng nhập
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) return res.status(400).json({ message: "Username is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    const user = await userService.findUserByUsername(username);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.Status === 'Đã nghỉ việc') {
      return res.status(403).json({ message: "User has resigned" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.UserID, role: user.Role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    return res.status(200).json({ message: "Login successful", token, role: user.Role, id: user.UserID });

  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
};

