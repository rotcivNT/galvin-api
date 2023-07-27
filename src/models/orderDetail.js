'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderDetail.belongsTo(models.Product, {
        foreignKey: 'productID',
        targetKey: 'productID',
      });
    }
  }
  OrderDetail.init(
    {
      orderID: DataTypes.STRING,
      productID: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      unitPrice: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderDetail',
    },
  );
  return OrderDetail;
};
