const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Workout = require('./workout');

const User = sequelize.define('user', {
  chatId: { type: DataTypes.INTEGER, primaryKey: true },
  restDays: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    allowNull: false
  }
});

User.hasMany(Workout, {
  foreignKey: 'chatId',
  onDelete: 'CASCADE'
});

Workout.belongsTo(User);

module.exports = User;
