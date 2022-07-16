const checkUsername = (username, allowedUsernamesStr = process.env.ALLOWED_USERNAMES) => {
  if (typeof allowedUsernamesStr !== 'string') {
    return false;
  }
  return allowedUsernamesStr.split(',').includes(username);
};

module.exports = checkUsername;
