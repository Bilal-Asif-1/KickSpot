import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../lib/sequelize.ts'

export class User extends Model {
  declare id: number
  declare name: string
  declare email: string
  declare password: string
  declare role: 'admin' | 'user'
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' },
  },
  { sequelize, tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false }
)


