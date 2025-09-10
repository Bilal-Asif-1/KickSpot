import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'

export class Notification extends Model {
  declare id: number
  declare title: string
  declare message: string
  declare type: 'order_update' | 'account_security' | 'cart_wishlist' | 'offers_promotions' | 'order' | 'new-customer' | 'low-stock' | 'product-updated' | 'payment-received' | 'inventory-alert'
  declare is_read: boolean
  declare admin_id: number | null
  declare user_id: number | null
  declare priority: 'low' | 'medium' | 'high'
  declare metadata: string | null  // JSON string for additional data
  declare order_id: number | null
  declare product_id: number | null
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    type: { 
      type: DataTypes.ENUM('order_update', 'account_security', 'cart_wishlist', 'offers_promotions', 'order', 'new-customer', 'low-stock', 'product-updated', 'payment-received', 'inventory-alert'), 
      allowNull: false 
    },
    is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    admin_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    priority: { type: DataTypes.ENUM('low', 'medium', 'high'), allowNull: false, defaultValue: 'medium' },
    metadata: { type: DataTypes.TEXT, allowNull: true },
    order_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
  },
  { sequelize, tableName: 'notifications', timestamps: true, createdAt: 'created_at', updatedAt: false }
)


