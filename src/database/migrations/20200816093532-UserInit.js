'use strict';

// 编写迁移脚本:脚本其实就是一个 `Node.js` 代码，提供给 `sequelize-cli` 进行读取执行，每一个脚本通过 `module.exports` 导出一个包含了 `down` 和 `up` 方法的对象

module.exports = {
  // 在 `up` 方法中，我们主要编写的创建表结构，或者新增修改表结构的相关代码。
  up: (queryInterface, Sequelize) => {
		/*
				up 需要返回一个 Promise
				queryInterface.createTable 方法用于创建表
						- 第一个参数是要创建的表的名称
						- 第二个参数是一个对象，用来描述表中包含的字段信息
						- queryInterface.createTable 返回一个 Promise
		*/
    return queryInterface.createTable('User', {
      id: {
        // 字段类型：数字
        type: Sequelize.INTEGER,
        // 设置为主键
        primaryKey: true,
        // 自动增长
        autoIncrement: true,
      },
      name: {
        // 字符串类型（20长度）
        type: Sequelize.STRING(20),
        // 值唯一
        unique: true,
        // 不允许 null 值
        allowNull: false
      },
      password: {
        // 字符串类型（32长度）
        type: Sequelize.STRING(32),
        // 不允许 null 值
        allowNull: false
      },
      createdAt: {
        // 日期类型
        type: Sequelize.DATE,
        // 不允许 null 值
        allowNull: false
      }
    });
  },
  // 执行撤销/回滚命令（`db:migrate:undo`）的时候调用
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // 删除 user 表
    await queryInterface.dropTable('User');
  }
};


