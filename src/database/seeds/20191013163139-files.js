// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');


module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('files',
    [
      {
        id: 1,
        name: faker.system.commonFileName('.jpg'),
        path: '0bc32c66-c138-40e0-bf0b-ea4775c982cf.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: faker.system.commonFileName('.jpg'),
        path: '72180061-1adc-4172-8ee1-981a970ccb87.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: faker.system.commonFileName('.jpg'),
        path: '1a65b3e4-271e-44f3-8365-72732fee8361.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('files', null, {}),
};
