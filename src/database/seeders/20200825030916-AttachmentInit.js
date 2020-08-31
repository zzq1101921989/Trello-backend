'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let date = new Date();
    let userIds = [1, 1, 2, 2, 1, 2, 1, 3, 2, 3];
    let types = ['image/png', 'image/png', 'image/gif', 'image/jpeg', 'image/git', 'image/png', 'image/png', 'image/png', 'image/png', 'image/png'];

    await queryInterface.bulkInsert('Attachment', userIds.map((name, index) => {
      let id = index + 1;
      return {
        id,
        userId: userIds[index],
        originName: 'originName-' + id,
        name: 'attachment-' + id,
        type: types[index],
        size: 10000,
        // path: '',
        // url: '',
        createdAt: date,
        updatedAt: date
      }
    }));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Attachment', null, {});
  }
};
