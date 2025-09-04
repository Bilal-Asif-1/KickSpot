const { Product, User } = require('../models');
const { Op } = require('sequelize');


exports.createProduct = async (productData, userId) => {
  const { name, description, price, category, stock } = productData;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    userId
  });

  // Fetch the created product with user info
  return await Product.findByPk(product.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};


exports.getAllProducts = async (options) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    category, 
    sortBy = 'createdAt', 
    sortOrder = 'DESC' 
  } = options;
  
  const offset = (page - 1) * limit;
  
  // Build where clause
  const whereClause = {};
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (category) {
    whereClause.category = category;
  }

  // Get products with pagination
  const { count, rows: products } = await Product.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: offset,
    order: [[sortBy, sortOrder]],
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });

  return {
    products,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

exports.getProductById = async (id) => {
  return await Product.findByPk(id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};


exports.getProductsByCategory = async (category) => {
  return await Product.findAll({
    where: { category },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};


exports.getUserProducts = async (userId) => {
  return await Product.findAll({
    where: { userId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};


exports.updateProduct = async (id, productData, userId) => {
  // Check if product exists and belongs to user
  const product = await Product.findOne({
    where: { id, userId }
  });

  if (!product) {
    return null;
  }

  // Update product
  await product.update(productData);

  // Return updated product with user info
  return await Product.findByPk(id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};


exports.deleteProduct = async (id, userId) => {
  // Check if product exists and belongs to user
  const product = await Product.findOne({
    where: { id, userId }
  });

  if (!product) {
    return false;
  }

  // Delete product
  await product.destroy();
  return true;
};