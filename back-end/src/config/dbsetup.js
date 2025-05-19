import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const sequelize = new Sequelize('project_test', 'root', 'hung1234', {
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql'
});
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'mysql',
//     logging: false
//   }
// );

try {
  await sequelize.authenticate();
  console.log("Đã kết nối với cơ sở dữ liệu");
} catch (error) {
  console.error("Lỗi kết nối CSDL:", error);
}

export default sequelize;