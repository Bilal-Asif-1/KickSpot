import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../lib/sequelize.ts'

export class OrderItem extends Model {
  declare id: number
  declare order_id: number
  declare product_id: number
  declare quantity: number
  declare price: number
  declare size?: string
}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    price: { type: DataTypes.FLOAT.UNSIGNED, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: 'order_items', timestamps: false }
)


