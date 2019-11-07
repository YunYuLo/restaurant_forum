//include database
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite
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
          description: r.dataValues.description.substring(0, 50),
          isFavorite: req.user.FavoriteRestaurants.map(d => d.id).includes(r.id),
          isLike: req.user.LikeRestaurants.map(d => d.id).includes(r.id)
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
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoriteUsers' },
        { model: User, as: 'LikeUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      const isFavorite = restaurant.FavoriteUsers.map(d => d.id).includes(req.user.id)
      const isLike = restaurant.LikeUsers.map(d => d.id).includes(req.user.id)

      restaurant.viewCounts = restaurant.viewCounts + 1
      restaurant.save().then(() => {
        return res.render('restaurant', { restaurant, isFavorite, isLike })
      })
    })
  },
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then((restaurants) => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then((comments) => {
        return res.render('feeds', {
          restaurants,
          comments,
        })
      })
    })
  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then((restaurant) => {
      return res.render('dashboard', { restaurant })
    })
  },
  getTopRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoriteUsers' }
      ]
    }).then((restaurants) => {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description.substring(0, 50),
        isFavorite: req.user.FavoriteRestaurants.map(d => d.id).includes(restaurant.id),
        FavoriteCount: restaurant.FavoriteUsers.length,
      }))
      restaurants = restaurants.sort((a, b) => b.FavoriteCount - a.FavoriteCount).splice(0, 10)
      console.log(restaurants)
      return res.render('topRestaurants', { restaurants })
    })
  },

}

module.exports = restController