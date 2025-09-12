import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../lib/sequelize.ts'

export class Order extends Model {
  declare id: number
  declare user_id: number
  declare total_price: number
  declare status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  declare payment_intent_id?: string
  declare customer_details?: any
  declare items?: any
  declare created_at: Date
}

Order.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    total_price: { type: DataTypes.FLOAT.UNSIGNED, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'processing', 'delivered', 'cancelled'), allowNull: false, defaultValue: 'pending' },
    payment_intent_id: { type: DataTypes.STRING, allowNull: true },
    customer_details: { type: DataTypes.JSON, allowNull: true },
    items: { type: DataTypes.JSON, allowNull: true },
  },
  { sequelize, tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: false }
)


