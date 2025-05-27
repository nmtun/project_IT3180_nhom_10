import { DataTypes } from "sequelize";
import sequelize from "../config/dbsetup.js";

const FeeType = sequelize.define("FeeType", {
  FeeTypeID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  FeeTypeName: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  Description: { 
    type: DataTypes.TEXT 
  },
  Category: { 
    type: DataTypes.ENUM('Bắt buộc', 'Tự nguyện'), 
    allowNull: false 
  },
  Scope: {
    type: DataTypes.ENUM('Chung', 'Riêng'),
    allowNull: false
  },
  UnitPrice: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  Unit: { 
    type: DataTypes.STRING(20) 
  }
}, {
    tableName: "FeeTypes",
    timestamps: false
});

export default FeeType;
