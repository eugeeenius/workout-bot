const app = require("../../index");
const sequelize = require('../../src/db');

describe('App initialization', () => {
  test('Sequelize connection', async () => {
    sequelize.authenticate = jest.fn();
    sequelize.sync = jest.fn();

    await app();

    // expect(sequelize.authenticate).toHaveBeenCalled();
    // expect(sequelize.sync).toHaveBeenCalled();
  });
});
