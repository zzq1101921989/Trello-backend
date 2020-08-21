'use strict';

module.exports = {
  // 编写执行的脚本默认就会执行 up 方法  sequelize db:migrate
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("User", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    // 编写回退的脚本默认就会执行 down 方法
    // sequelize db:migrate:undo 
    // sequelize db:migrate:undo:all
    return queryInterface.removeColumn('User', 'updatedAt');
  }
};
