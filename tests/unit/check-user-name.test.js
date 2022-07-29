const checkUserName = require('../../src/utils/check-user-name');
require('dotenv').config();

describe('checkUserName', () => {
  test('username is not string', () => {
    expect(checkUserName(null)).toBe(false);
  });
  test('allowedUserNamesStr is not string', () => {
    const USERNAME = 'user';
    expect(checkUserName(USERNAME, null)).toBe(false);
  });
  test('allowed username', () => {
    const USERNAME = process.env.ALLOWED_USERNAMES.split(',')[0];
    expect(checkUserName(USERNAME)).toBe(true);
  });
  test('forbidden username', () => {
    const USERNAME = 'forbidden_user';
    expect(checkUserName(USERNAME)).toBe(false);
  });
});
