const checkUsername = require('../../src/utils/checkUsername');
require('dotenv').config();

describe('checkUsername', () => {
  test('username is not string', () => {
    expect(checkUsername(null)).toBe(false);
  });
  test('allowedUserNamesStr is not string', () => {
    const USERNAME = 'user';
    expect(checkUsername(USERNAME, null)).toBe(false);
  });
  test('allowed username', () => {
    const USERNAME = process.env.ALLOWED_USERNAMES.split(',')[0];
    expect(checkUsername(USERNAME)).toBe(true);
  });
  test('forbidden username', () => {
    const USERNAME = 'forbidden_user';
    expect(checkUsername(USERNAME)).toBe(false);
  });
});
