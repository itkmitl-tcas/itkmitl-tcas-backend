import { Model, DataTypes } from 'sequelize';
import { database } from '../../config/database';

/* ---------------------------------- Class --------------------------------- */
export class PortfolioType extends Model {
  type_id?: number;
  name: string;
  desc: string;
  score: number;
  group: string;
}
export class Portfolio extends Model {
  port_id?: number; // auto increase
  apply_id?: number;
  type_id?: number;
  name?: string;
  desc?: string;
  file?: string;
}

/* -------------------------------- Interface ------------------------------- */
export type IPortfolio = Portfolio;
export type IPortfolioType = PortfolioType;

/* --------------------------------- Modules -------------------------------- */
Portfolio.init(
  {
    port_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    apply_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'apply_id',
      },
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'portfolio_type',
        key: 'type_id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'portfolio',
    modelName: 'portfolio',
    sequelize: database,
  },
);

PortfolioType.init(
  {
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'portfolio_type',
    modelName: 'portfolio_type',
    sequelize: database,
  },
);

PortfolioType.hasOne(Portfolio, {
  sourceKey: 'type_id',
  foreignKey: 'type_id',
});
Portfolio.belongsTo(PortfolioType, {
  targetKey: 'type_id',
  foreignKey: 'type_id',
});

/* ---------------------------------- Sync ---------------------------------- */
PortfolioType.sync({ alter: true });
Portfolio.sync({ alter: true });
