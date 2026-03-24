import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sla_atendimento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sla_resolucao: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "categorias",
    timestamps: false,
  },
);

export default Categoria;
