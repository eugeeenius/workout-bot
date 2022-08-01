const sequelize = require('../../db');

module.exports = () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });await start();
  });

  afterAll(async () => {
    await sequelize.close();
  });
};
