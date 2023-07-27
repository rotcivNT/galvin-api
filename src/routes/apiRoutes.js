const express = require('express');
const productController = require('../controller/productController');
const categoryController = require('../controller/categoryController');
const voucherController = require('../controller/voucherController');
const userController = require('../controller/userController');
const orderController = require('../controller/orderController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const initApiRoutes = (app) => {
  router.post(
    '/api/add-product',
    upload.single('filename'),
    productController.addNewProduct,
  );
  router.get(
    '/api/get-all-child-category',
    categoryController.getAllChildCategory,
  );
  router.get('/api/get-all-color', productController.getAllColor);
  router.get('/api/get-all-size', productController.getAllSize);
  router.get('/api/get-all-product', productController.getAllProduct);
  router.post('/api/update-product', productController.updateProduct);
  router.get('/api/get-all-category', productController.getAllCategory);
  // Voucher
  router.get('/api/get-all-voucher', voucherController.getAllVoucher);
  router.get(
    '/api/get-voucher-by-code/:code',
    voucherController.getVoucherByCode,
  );
  router.get(
    '/api/get-first-product-by-catelog/:id',
    productController.getFirstProductByCateLog,
  );
  // Get 8 new product
  router.get('/api/get-new-product', productController.getNewProduct);
  router.get('/api/get-product/:id', productController.getProductByID);
  router.get(
    '/api/get-products-by-cate-id',
    productController.getProductByCount,
  );
  // User
  router.post('/api/create-user', userController.createUser);
  router.post('/api/check-user', userController.checkUserLogin);
  // Product Cart
  router.post('/api/add-product-cart', userController.addProductToCart);
  router.get(
    '/api/delete-product-cart/:id',
    userController.deleteProductToCart,
  );
  router.get('/api/get-product-cart/:userID', userController.getProductCart);
  router.post(
    '/api/get-all-product-by-category',
    productController.getAllProductByCategory,
  );
  router.get(
    '/api/delete-product-cart-by-userID/:userID',
    userController.deleteProductCartByUserID,
  );

  // Order
  router.get('/api/get-all-order', orderController.getAllOrder);
  router.post('/api/create-order', orderController.createOrder);
  router.get('/api/accept-order', orderController.acceptOrder);
  router.get(
    '/api/get-order-details/:orderID',
    orderController.getOrderDetails,
  );

  return app.use('/', router);
};

module.exports = initApiRoutes;
