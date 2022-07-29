const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Workout = require('./workout');

const User = sequelize.define('user', {
  chatId: { type: DataTypes.INTEGER, primaryKey: true },
});

User.hasMany(Workout, {
  foreignKey: 'chatId'
});
Workout.belongsTo(User);

module.exports = User;
