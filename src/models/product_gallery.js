'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_Gallery.belongsTo(models.Product, {
        foreignKey: 'productID',
        targetKey: 'productID',
      });
    }
  }
  Product_Gallery.init(
    {
      productID: DataTypes.STRING,
      colorID: DataTypes.INTEGER,
      imagePath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Product_Gallery',
    },
  );
  return Product_Gallery;
};
