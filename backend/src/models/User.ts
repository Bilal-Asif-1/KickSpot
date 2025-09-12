import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../lib/sequelize.ts'

export class User extends Model {
  declare id: number
  declare name: string
  declare email: string
  declare password: string
  declare role: 'admin' | 'user'
  // Common fields for both buyers and sellers
  declare contactNumber: string
  declare deliveryAddress: string
  // Seller-specific fields
  declare businessAddress?: string
  declare cnicNumber?: string
  declare bankAccountNumber?: string
  declare bankName?: string
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' },
    // Common fields for both buyers and sellers
    contactNumber: { type: DataTypes.STRING, allowNull: false },
    deliveryAddress: { type: DataTypes.TEXT, allowNull: true },
    // Seller-specific fields (optional)
    businessAddress: { type: DataTypes.TEXT, allowNull: true },
    cnicNumber: { type: DataTypes.STRING, allowNull: true },
    bankAccountNumber: { type: DataTypes.STRING, allowNull: true },
    bankName: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false }
)


