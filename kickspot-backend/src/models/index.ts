import { User } from './User'
import { Product } from './Product'
import { Order } from './Order'
import { OrderItem } from './OrderItem'
import { Notification } from './Notification'

Order.belongsTo(User, { foreignKey: 'user_id' })
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })
OrderItem.belongsTo(Product, { foreignKey: 'product_id' })
Order.hasMany(OrderItem, { foreignKey: 'order_id' })

export { User, Product, Order, OrderItem, Notification }


