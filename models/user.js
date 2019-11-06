'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Comment)
    //Many to many
    User.belongsToMany(models.Restaurant, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoriteRestaurants'
    })
    User.belongsToMany(models.Restaurant, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikeRestaurants'
    })
  };
  return User;
};