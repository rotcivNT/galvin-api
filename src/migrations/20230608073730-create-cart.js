'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userID: {
        type: Sequelize.INTEGER,
      },
      productID: {
        type: Sequelize.STRING,
      },
      productName: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      sizeValue: {
        type: Sequelize.STRING,
      },
      colorValue: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      saleOff: {
        type: Sequelize.INTEGER,
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  },
};
