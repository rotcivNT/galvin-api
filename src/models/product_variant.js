'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Variant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_Variant.belongsTo(models.Product, {
        foreignKey: 'productID',
        targetKey: 'productID',
      });
    }
  }
  Product_Variant.init(
    {
      productID: DataTypes.STRING,
      colorID: DataTypes.INTEGER,
      sizeID: DataTypes.INTEGER,
      qtyStock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Product_Variant',
    },
  );
  return Product_Variant;
};
