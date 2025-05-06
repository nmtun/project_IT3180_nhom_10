import { DataTypes } from "sequelize";
import sequelize from "../config/dbsetup.js";
import Resident from "./Resident.js";

const Change = sequelize.define("Change", {
  ChangeID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  ResidentID: { 
    type: DataTypes.INTEGER, 
    references: { model: Resident, key: "ResidentID" } 
  },
  ChangeType: { 
    type: DataTypes.ENUM('Mới chuyển đến', 'Đã chuyển đi', 'Other'), 
    allowNull: false 
  },
  ChangeDate: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  ChangeDetails: { 
    type: DataTypes.TEXT 
  }
}, {
  tableName: "Changes",
  timestamps: false
});

Change.belongsTo(Resident, { foreignKey: "ResidentID" });

export default Change;
