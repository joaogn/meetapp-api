module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      "users_meetups",
      [
        {
          user_id: 1,
          meetup_id: 7,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user_id: 2,
          meetup_id: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user_id: 3,
          meetup_id: 5,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    ),

  down: queryInterface => queryInterface.bulkDelete("users_meetups", null, {})
};
