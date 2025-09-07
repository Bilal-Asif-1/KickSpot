export default (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // Buyer Details
    buyerName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    buyerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    buyerPhone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 15],
      },
    },
    // Shipping Address
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shippingCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingState: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingZip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingCountry: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USA',
    },
    // Payment Info
    paymentMethod: {
      type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'cash_on_delivery'),
      allowNull: false,
      defaultValue: 'cash_on_delivery',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    // Order Notes
    orderNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Tracking
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'Orders',
    timestamps: true,
    hooks: {
      beforeValidate: (order) => {
        // Generate unique order number if not set
        if (!order.orderNumber) {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 1000);
          order.orderNumber = `ORD-${timestamp}-${random}`;
        }
      }
    }
  });

  return Order;
};
