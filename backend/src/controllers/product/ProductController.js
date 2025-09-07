import BaseController from '../base/BaseController.js';
import { productService } from '../../services/index.js';

class ProductController extends BaseController {

  createProduct = async (req, res, next) => {
    try {
      const productData = req.body;
      const userId = req.userId;

      const createdProduct = await productService.createProduct(productData, userId);

      return this.sendSuccess(
        res, 
        'Product created successfully', 
        { product: createdProduct }, 
        201
      );
    } catch (error) {
      next(error);
    }
  };


  getProductById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const product = await productService.getProductById(id);
      
      if (!product) {
        return this.sendError(res, 'Product not found', 404);
      }
      
      return this.sendSuccess(
        res, 
        'Product retrieved successfully', 
        { product }
      );
    } catch (error) {
      next(error);
    }
  };


  updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      const userId = req.userId;
      
      const updatedProduct = await productService.updateProduct(id, productData, userId);
      
      if (!updatedProduct) {
        return this.sendError(
          res, 
          'Product not found or you are not authorized to update this product', 
          404
        );
      }
      
      return this.sendSuccess(
        res, 
        'Product updated successfully', 
        { product: updatedProduct }
      );
    } catch (error) {
      next(error);
    }
  };


  deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
      
      const success = await productService.deleteProduct(id, userId);
      
      if (!success) {
        return this.sendError(
          res, 
          'Product not found or you are not authorized to delete this product', 
          404
        );
      }
      
      return this.sendSuccess(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
