import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Usuario from "./Usuario";

class ChamadoLog extends Model {
  id!: number;
  chamado_id!: number;
  status_anterior!: string;
  status_novo!: string;
  usuario_id!: number;
  acao!: string;
  descricao!: string;
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
      allowNull: true,
    },
    status_novo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    acao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
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

ChamadoLog.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

export default ChamadoLog;
