'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productID: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      productName: {
        type: Sequelize.STRING,
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      saleOff: {
        type: Sequelize.INTEGER,
      },
      categoryID: {
        type: Sequelize.INTEGER,
      },
      description: {
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
    await queryInterface.dropTable('Products');
  },
};
