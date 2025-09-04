const BaseController = require('../base/BaseController');
const { productService } = require('../../services');

class ProductQueryController extends BaseController {

  getAllProducts = async (req, res, next) => {
    try {
      const queryOptions = req.query;
      
      const result = await productService.getAllProducts(queryOptions);
      
      const pagination = {
        total: result.count,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: parseInt(queryOptions.limit || 10)
      };
      
      return this.sendPagination(
        res, 
        { products: result.products },
        pagination,
        'Products retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  };


  getProductsByCategory = async (req, res, next) => {
    try {
      const { category } = req.params;
      
      const products = await productService.getProductsByCategory(category);
      
      return this.sendSuccess(
        res, 
        `Products in category '${category}' retrieved successfully`, 
        { products }
      );
    } catch (error) {
      next(error);
    }
  };


  getUserProducts = async (req, res, next) => {
    try {
      const userId = req.userId;
      
      const products = await productService.getUserProducts(userId);
      
      return this.sendSuccess(
        res, 
        'User products retrieved successfully', 
        { products }
      );
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ProductQueryController();