export default (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    // Product details at time of order (in case product changes later)
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    productCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productBrand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Order specific details
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // Size/Variant info (for shoes)
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    variant: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'OrderItems',
    timestamps: true,
    hooks: {
      beforeSave: (orderItem) => {
        // Calculate total price
        orderItem.totalPrice = orderItem.quantity * orderItem.unitPrice;
      }
    }
  });

  return OrderItem;
};
