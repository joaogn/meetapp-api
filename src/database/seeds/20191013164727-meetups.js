// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require("faker");
const addDays = require("date-fns/addDays");
const addHours = require("date-fns/addHours");
const subHours = require("date-fns/subHours");

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      "meetups",
      [
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: addDays(new Date(), 1),
          banner_id: 1,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: addHours(new Date(), 3),
          banner_id: 2,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: subHours(new Date(), 1),
          banner_id: 3,
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: addDays(new Date(), 1),
          banner_id: 3,
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: addHours(new Date(), 3),
          banner_id: 2,
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: subHours(new Date(), 1),
          banner_id: 1,
          user_id: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: addDays(new Date(), 1),
          banner_id: 2,
          user_id: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: addHours(new Date(), 3),
          banner_id: 1,
          user_id: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          location: faker.address.streetAddress(),
          date: subHours(new Date(), 1),
          banner_id: 3,
          user_id: 3,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    ),

  down: queryInterface => queryInterface.bulkDelete("meetups", null, {})
};
