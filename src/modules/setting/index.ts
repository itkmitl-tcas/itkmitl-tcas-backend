import sequelize from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { database } from '../../config/database';

export class Setting extends Model {
  setting_id?: number;
  name: string;
  value: boolean;
}

Setting.init(
  {
    setting_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'setting',
    modelName: 'setting',
    sequelize: database, // this bit is important
  },
);

Setting.sync({ alter: true });

async function initial() {
  const client_access = await Setting.findOne({
    where: {
      name: 'client-access',
    },
  });

  if (client_access) return;

  Setting.create({
    name: 'client-access',
    value: true,
  });
}

initial();
