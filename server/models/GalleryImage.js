const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GalleryImage = sequelize.define(
  "GalleryImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "gallery_images",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = GalleryImage;
