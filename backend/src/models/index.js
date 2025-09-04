// Import database configuration
const { sequelize, Sequelize } = require("../config/database.js");

// Import models
const User = require("./user.js")(sequelize, Sequelize.DataTypes);
const Product = require("./product.js")(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Product,
};
