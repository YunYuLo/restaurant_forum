'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER
  }, {});
  Restaurant.associate = function (models) {
    // associations can be defined here
    Restaurant.belongsTo(models.Category)
    Restaurant.hasMany(models.Comment)
    //Many to many
    Restaurant.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'RestaurantId',
      as: 'FavoriteUsers'
    })
    Restaurant.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'RestaurantId',
      as: 'LikeUsers'
    })
  };
  return Restaurant;
};