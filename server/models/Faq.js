const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Faq = sequelize.define(
  'Faq',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    tableName: 'faqs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

module.exports = Faq;
