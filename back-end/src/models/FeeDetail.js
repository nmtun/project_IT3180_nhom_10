import { DataTypes } from "sequelize";
import sequelize from "../config/dbsetup.js";
import FeeCollection from "./FeeCollection.js";
import Household from "./Household.js";

const FeeDetail = sequelize.define("FeeDetail", {
  FeeDetailID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  CollectionID: { 
    type: DataTypes.INTEGER, 
    references: { model: FeeCollection, key: "CollectionID" } 
  },
  HouseholdID: { 
    type: DataTypes.INTEGER, 
    references: { model: Household, key: "HouseholdID" } 
  },
  Amount: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: true
  },
  PaymentDate: { 
    type: DataTypes.DATEONLY 
  },
  PaymentMethod: { 
    type: DataTypes.ENUM('Tiền mặt', 'Chuyển khoản'),
    allowNull: false 
  },
  PaymentStatus: { 
    type: DataTypes.ENUM('Chưa đóng', 'Đã đóng'), 
    allowNull: false 
  },
}, {
  tableName: "FeeDetails",
  timestamps: false
});

FeeDetail.belongsTo(FeeCollection, { foreignKey: "CollectionID" });
FeeDetail.belongsTo(Household, { foreignKey: "HouseholdID" });

export default FeeDetail;
