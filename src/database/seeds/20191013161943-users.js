// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');


module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('users',
    [
      {
        name: 'Mucilon',
        email: 'muci@gmail.com',
        password_hash: bcrypt.hashSync('123456', 8),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tonho do Charque',
        email: 'tonho@gmail.com',
        password_hash: bcrypt.hashSync('123456', 8),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Biro Biro',
        email: 'biro@gmail.com',
        password_hash: bcrypt.hashSync('123456', 8),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
