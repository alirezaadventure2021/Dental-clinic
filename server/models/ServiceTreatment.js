const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceTreatment = sequelize.define(
  'ServiceTreatment',
  {
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'services',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    treatment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'treatments',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'service_treatments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

module.exports = ServiceTreatment;
