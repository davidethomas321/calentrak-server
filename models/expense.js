const { DataTypes } = require('sequelize');
const db = require('../db');

const Expense = db.define('expense', {
    idNumber: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
    },
    expense: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    writeDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Expense;