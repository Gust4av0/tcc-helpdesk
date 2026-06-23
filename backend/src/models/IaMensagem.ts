import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Usuario from "./Usuario";

const IaMensagem = sequelize.define(
  "IaMensagem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pergunta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resposta: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ia_mensagens",
    timestamps: false,
  },
);

IaMensagem.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

export default IaMensagem;