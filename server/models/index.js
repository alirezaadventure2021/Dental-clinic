const sequelize = require("../config/database");
const User = require("./User");
const Service = require("./Service");
const Treatment = require("./Treatment");
const ServiceTreatment = require("./ServiceTreatment");
const GalleryImage = require("./GalleryImage");
const Faq = require("./Faq");
const Message = require("./Message");

Service.belongsToMany(Treatment, {
  through: ServiceTreatment,
  foreignKey: "service_id",
  otherKey: "treatment_id",
  as: "treatments",
});

Treatment.belongsToMany(Service, {
  through: ServiceTreatment,
  foreignKey: "treatment_id",
  otherKey: "service_id",
  as: "services",
});

Service.hasMany(GalleryImage, {
  foreignKey: "service_id",
  as: "gallery_images",
  onDelete: "CASCADE",
});

GalleryImage.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
});

const db = {
  sequelize,
  User,
  Service,
  Treatment,
  ServiceTreatment,
  GalleryImage,
  Faq,
  Message,
};

module.exports = db;
