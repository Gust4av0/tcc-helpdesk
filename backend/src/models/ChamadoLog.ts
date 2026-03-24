import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class ChamadoLog extends Model {
  id!: number;
  chamado_id!: number;
  status_anterior!: string;
  status_novo!: string;
  usuario_id!: number;
}

ChamadoLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chamado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_anterior: {
      type: DataTypes.STRING,
    },
    status_novo: {
      type: DataTypes.STRING,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "chamado_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default ChamadoLog;