module.exports = {
  text: 'Выберите группу',
  form: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Спина',
            callback_data: '/back'
          },
          {
            text: 'Грудь',
            callback_data: '/chest'
          }
        ]
      ]
    }
  }
};
