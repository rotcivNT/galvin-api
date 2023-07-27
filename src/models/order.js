'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      orderID: DataTypes.STRING,
      employeeID: DataTypes.INTEGER,
      orderDate: DataTypes.STRING,
      status: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      totalDue: DataTypes.INTEGER,
      shippedAddress: DataTypes.STRING,
      customerName: DataTypes.STRING,
      customerPhone: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  return Order;
};
