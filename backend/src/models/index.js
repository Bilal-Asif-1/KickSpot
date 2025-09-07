// Import database configuration
import { sequelize, Sequelize } from "../config/database.js";

// Import models
import UserModel from "./user.js";
import ProductModel from "./product.js";

const User = UserModel(sequelize, Sequelize.DataTypes);
const Product = ProductModel(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  sequelize,
  User,
  Product,
};
