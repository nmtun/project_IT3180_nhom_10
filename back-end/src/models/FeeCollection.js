import { DataTypes } from "sequelize";
import sequelize from "../config/dbsetup.js";
import FeeType from "./FeeType.js";

const FeeCollection = sequelize.define("FeeCollection", {
  CollectionID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  FeeTypeID: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: FeeType, key: "FeeTypeID" } 
  },
  CollectionName: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  StartDate: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  EndDate: { 
    type: DataTypes.DATEONLY 
  },
  TotalAmount: { 
    type: DataTypes.DECIMAL(15, 2), 
    allowNull: true
  },
  Status: { 
    type: DataTypes.ENUM('Đang thu', 'Hoàn thành', 'Kết thúc'), 
    allowNull: false 
  },
  Notes: { 
    type: DataTypes.TEXT 
  }
}, {
  tableName: "FeeCollections",
  timestamps: false
});

FeeCollection.belongsTo(FeeType, { foreignKey: "FeeTypeID" });

export default FeeCollection;
