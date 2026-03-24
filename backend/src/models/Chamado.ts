import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Usuario from "./Usuario";
import Categoria from "./Categoria";

const Chamado = sequelize.define(
  "Chamado",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("NOVO", "ATRIBUIDO", "EM_ATENDIMENTO", "FINALIZADO"),
      defaultValue: "NOVO",
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tecnico_id: {
      type: DataTypes.INTEGER,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prioridade: {
      type: DataTypes.ENUM("BAIXA", "MEDIA", "ALTA", "URGENTE"),
      defaultValue: "MEDIA",
    },
    prazo_atendimento: {
      type: DataTypes.DATE,
    },
    prazo_resolucao: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "chamados",
    timestamps: false,
  },
);

// 🔗 RELACIONAMENTOS
Chamado.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });
Chamado.belongsTo(Usuario, { foreignKey: "tecnico_id", as: "tecnico" });
Chamado.belongsTo(Categoria, { foreignKey: "categoria_id", as: "categoria" });

export default Chamado;
