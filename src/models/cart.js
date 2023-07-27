'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cart.init(
    {
      userID: DataTypes.INTEGER,
      productID: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      sizeValue: DataTypes.STRING,
      colorValue: DataTypes.STRING,
      price: DataTypes.INTEGER,
      thumbnail: DataTypes.STRING,
      productName: DataTypes.STRING,
      saleOff: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Cart',
    },
  );
  return Cart;
};
