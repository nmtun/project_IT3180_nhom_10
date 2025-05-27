import { DataTypes } from "sequelize";
import sequelize from "../config/dbsetup.js";
import Household from "./Household.js";

const Resident = sequelize.define("Resident", {
  ResidentID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  HouseholdID: { 
    type: DataTypes.INTEGER, 
    references: { model: Household, key: "HouseholdID" } 
  },
  FullName: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  DateOfBirth: { 
    type: DataTypes.DATEONLY 
  },
  Sex: { 
    type: DataTypes.ENUM('Nam', 'Nữ'), 
    allowNull: false 
  },
  Relationship: { 
    type: DataTypes.ENUM( 'Chủ hộ', 'Vợ', 'Chồng', 'Con', 'Cha', 'Mẹ', 'Anh', 'Chị', 'Em', 'Khác'), 
    allowNull: false 
  },
  PhoneNumber: { 
    type: DataTypes.STRING(20) 
  },
  EducationLevel: { 
    type: DataTypes.STRING(50) 
  },
  Occupation: { 
    type: DataTypes.STRING(100) 
  },
  ResidencyStatus: { 
    type: DataTypes.ENUM('Thường trú', 'Tạm trú', 'Tạm vắng', 'Đã chuyển đi'), 
    allowNull: false,
    defaultValue: 'Tạm trú' 
  },
  RegistrationDate: { 
    type: DataTypes.DATEONLY 
  }
}, {
  tableName: "Residents",
  timestamps: false
});

Resident.belongsTo(Household, { foreignKey: "HouseholdID" });

export default Resident;
