import { DataTypes } from "sequelize";
import sequelize from "../config/dbsetup.js";
import Household from "./Household.js";

const Vehicle = sequelize.define("Vehicle", {
  VehicleID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  HouseholdID: { 
    type: DataTypes.INTEGER, 
    references: { model: Household, key: "HouseholdID" } 
  },
  VehicleType: { 
    type: DataTypes.ENUM('Xe máy', 'Ô tô'), 
    allowNull: false 
  },
  LicensePlate: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
  Brand: { 
    type: DataTypes.STRING(50) 
  },
  Color: { 
    type: DataTypes.STRING(50) 
  },
  RegistrationDate: { 
    type: DataTypes.DATEONLY,
    allowNull: false 
  },
  Status: { 
    type: DataTypes.ENUM('Còn hạn đăng ký gửi', 'Hết hạn đăng ký gửi'), 
    allowNull: false 
  }
}, {
  tableName: "Vehicles",
  timestamps: false
}); 

Vehicle.belongsTo(Household, { foreignKey: "HouseholdID" });

export default Vehicle;
