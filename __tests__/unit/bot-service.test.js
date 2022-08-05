const BotService = require('../../src/services/bot-service');

describe('BotService', () => {
  describe('checkUserName', () => {
    test('username is not string', () => {
      expect(BotService.checkUserName(null)).toBe(false);
    });

    test('allowedUserNamesStr is not string', () => {
      const USERNAME = 'user';
      expect(BotService.checkUserName(USERNAME, null)).toBe(false);
    });

    test('allowed username', () => {
      const USERNAME = process.env.ALLOWED_USERNAMES.split(',')[0];
      expect(BotService.checkUserName(USERNAME)).toBe(true);
    });

    test('forbidden username', () => {
      const USERNAME = 'forbidden_user';
      expect(BotService.checkUserName(USERNAME)).toBe(false);
    });
  });
})
