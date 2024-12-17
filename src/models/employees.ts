import { DataTypes, Model } from "sequelize";
import sequelizeInstance from "./index";

class Employees extends Model {
  public id!: string;
  public name!: string;
  public sickLeave!: number;
  public priviligeLeave!: number;
  public shortLeave!: number;
}

Employees.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    sickLeave: DataTypes.DOUBLE,
    priviligeLeave: DataTypes.DOUBLE,
    shortLeave: DataTypes.DOUBLE,
  },
  {
    sequelize: sequelizeInstance,
    modelName: "employees",
    tableName: "employees",
  }
);

export default Employees;
