import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../lib/sequelize.ts'

export class Notification extends Model {
  declare id: number
  declare message: string
  declare type: 'order' | 'new-customer' | 'low-stock'
  declare is_read: boolean
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    message: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('order', 'new-customer', 'low-stock'), allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: 'notifications', timestamps: true, createdAt: 'created_at', updatedAt: false }
)


