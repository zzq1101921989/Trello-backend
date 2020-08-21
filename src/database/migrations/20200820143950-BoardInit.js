'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Board", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }, {
      charset: 'utf8mb4'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Board")
  }
};