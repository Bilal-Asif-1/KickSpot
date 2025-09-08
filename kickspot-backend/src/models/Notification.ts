import { DataTypes, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '@/lib/sequelize'

export class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {
  declare id: CreationOptional<number>
  declare message: string
  declare type: 'order' | 'new-customer' | 'low-stock'
  declare is_read: CreationOptional<boolean>
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


