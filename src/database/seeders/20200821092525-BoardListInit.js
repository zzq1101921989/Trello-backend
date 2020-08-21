'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let date = new Date();
    let userIds = [1, 1, 1, 2, 2, 1, 2, 1, 2, 1];
    let boardIds = [1, 1, 2, 3, 4, 5, 6, 7, 3, 2];
    await queryInterface.bulkInsert('BoardList', boardIds.map((name, index) => {
      let id = index + 1;
      return {
        id,
        userId: userIds[index],
        boardId: boardIds[index],
        name: 'board-list-' + id,
        order: 65536 * id,
        createdAt: date,
        updatedAt: date
      }
    }));
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('BoardList', null, {});
  }
};
