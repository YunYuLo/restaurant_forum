//include database
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const pageLimit = 10

let restController = {
  //action: 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit })
      .then(result => {
        //data for pagination
        let page = Number(req.query.page) || 1
        let pages = Math.ceil(result.count / pageLimit)
        let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        let prev = page - 1 < 1 ? 1 : page - 1
        let next = page + 1 > pages ? pages : page + 1
        //clean up restaurant data
        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50)
        }))
        Category.findAll()
          .then((categories) => {
            return res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId,
              page,
              totalPage,
              prev,
              next
            })
          })
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