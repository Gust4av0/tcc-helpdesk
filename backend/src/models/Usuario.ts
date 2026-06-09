import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Usuario = sequelize.define(
  "Usuario",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      defaultValue: "CLIENTE",
    },
    cpf_cnpj: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  },
);

export default Usuario;
