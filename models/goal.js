const { DataTypes } = require('sequelize');
const db = require('../db');

const Goal = db.define('goal', {
    idNumber: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
    },
    goal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    writeDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Goal;