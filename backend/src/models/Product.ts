import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../lib/sequelize.ts'

export class Product extends Model {
  declare id: number
  declare name: string
  declare category: string
  declare price: number
  declare stock: number
  declare description: string | null
  declare image_url: string | null
  declare seller_id: number | null
  declare buyCount: number
}

Product.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT.UNSIGNED, allowNull: false },
    stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    description: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.STRING, allowNull: true },
    seller_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    buyCount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  },
  { sequelize, tableName: 'products', timestamps: true, createdAt: 'created_at', updatedAt: false }
)


