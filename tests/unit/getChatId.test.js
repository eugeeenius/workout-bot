const getChatId = require('../../src/utils/getChatId');

describe('getChatId', () => {
  test('if message undefined', () => {
    const message = undefined;
    expect(getChatId(message)).toBe(undefined);
  });
});
