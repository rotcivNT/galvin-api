'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Product_Variants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productID: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      colorID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      sizeID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      qtyStock: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Product_Variants');
  }
};