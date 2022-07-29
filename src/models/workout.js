const sequelize = require('../db');
const WorkoutTypes = require('../enum/workout-types');
const MuscleGroup = require('../enum/muscle-group');
const { DataTypes } = require('sequelize');

const Workout = sequelize.define('workout', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chatId: { type: DataTypes.INTEGER },
  type: { type: DataTypes.ENUM(Object.values(WorkoutTypes)) },
  muscleGroup: { type: DataTypes.ENUM(Object.values(MuscleGroup)) },
  approaches: { type: DataTypes.ARRAY(DataTypes.INTEGER) }
});

module.exports = Workout;
