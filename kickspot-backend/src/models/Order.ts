import { DataTypes, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize'
import { sequelize } from '@/lib/sequelize'

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>
  declare user_id: number
  declare total_price: number
  declare status: CreationOptional<'pending' | 'processing' | 'delivered'>
}

Order.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    total_price: { type: DataTypes.FLOAT.UNSIGNED, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'processing', 'delivered'), allowNull: false, defaultValue: 'pending' },
  },
  { sequelize, tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: false }
)


