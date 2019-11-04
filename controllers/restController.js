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

  //getRestaurant: (req, res) => {},
  //getFeeds: (req, res) => {},
  //getDashboard: (req, res) => {},
  //getTopRestaurants: (req, res) => {},

}

module.exports = restController