// Import database configuration
import { sequelize, Sequelize } from "../config/database.js";

// Import models
import UserModel from "./user.js";
import ProductModel from "./product.js";
import OrderModel from "./order.js";
import OrderItemModel from "./orderItem.js";

const User = UserModel(sequelize, Sequelize.DataTypes);
const Product = ProductModel(sequelize, Sequelize.DataTypes);
const Order = OrderModel(sequelize, Sequelize.DataTypes);
const OrderItem = OrderItemModel(sequelize, Sequelize.DataTypes);

// Define associations

// User-Product associations
User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User-Order associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

// Order-OrderItem associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product-OrderItem associations
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

export {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
};
