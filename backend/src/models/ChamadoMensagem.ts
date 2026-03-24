import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class ChamadoMensagem extends Model {
  id!: number;
  chamado_id!: number;
  usuario_id!: number;
  mensagem!: string;
  anexo!: string;
}

ChamadoMensagem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chamado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    anexo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "chamado_mensagens",
    timestamps: false,
  },
);

export default ChamadoMensagem;
