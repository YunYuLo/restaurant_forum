//include database
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let restController = {
  //action: 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category })
      .then((restaurants) => {
        const data = restaurants.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        return res.render('restaurant', { restaurant })
      })
  },
  //getFeeds: (req, res) => {},
  //getDashboard: (req, res) => {},
  //getTopRestaurants: (req, res) => {},

}

module.exports = restController