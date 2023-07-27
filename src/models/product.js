'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Product_Variant, {
        foreignKey: 'productID',
        sourceKey: 'productID',
        as: 'Variant',
      });
      Product.hasMany(models.Product_Gallery, {
        foreignKey: 'productID',
        sourceKey: 'productID',
        as: 'Gallery',
      });
      Product.hasMany(models.Product_Gallery, {
        foreignKey: 'productID',
        sourceKey: 'productID',
        as: 'OrderDetails',
      });
    }
  }
  Product.init(
    {
      productID: DataTypes.STRING,
      productName: DataTypes.STRING,
      price: DataTypes.INTEGER,
      saleOff: DataTypes.INTEGER,
      categoryID: DataTypes.INTEGER,
      description: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Product',
    },
  );
  return Product;
};
