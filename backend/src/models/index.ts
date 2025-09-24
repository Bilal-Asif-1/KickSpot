import { User } from './User.js'
import { Product } from './Product.js'
import { Order } from './Order.js'
import { OrderItem } from './OrderItem.js'
import { Notification } from './Notification.js'

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' })
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'orderItems' })
Product.belongsTo(User, { foreignKey: 'seller_id', as: 'seller', constraints: false })
User.hasMany(Product, { foreignKey: 'seller_id', as: 'products', constraints: false })
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' })
User.hasMany(Notification, { foreignKey: 'admin_id', as: 'notifications' })
Notification.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' })

export { User, Product, Order, OrderItem, Notification }


