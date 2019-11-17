const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite

const pageLimit = 10

const restService = {
  getRestaurants: (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorite: req.user.FavoriteRestaurants.map(d => d.id).includes(r.id),
        isLike: req.user.LikeRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll().then(categories => {
        return callback({
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoriteUsers' },
        { model: User, as: 'LikeUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      restaurant.viewCounts += 1
      restaurant.save()
        .then(restaurant => {
          const isFavorite = restaurant.FavoriteUsers.map(d => d.id).includes(req.user.id)
          const isLike = restaurant.LikeUsers.map(d => d.id).includes(req.user.id)
          callback({
            restaurant: restaurant,
            isFavorite: isFavorite,
            isLike: isLike
          })
        })
    })
  },
  getFeeds: (req, res, callback) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        callback({
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },
  getDashboard: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      return callback({ restaurant: restaurant })
    })
  },
  getTopRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoriteUsers' }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(d => ({
        ...d.dataValues,
        // description: d.description.substring(0, 50),
        isFavorite: req.user.FavoriteRestaurants.map(d => d.id).includes(d.id),
        FavoriteCount: d.FavoriteUsers.length
      }))
      restaurants = restaurants.sort((a, b) => a.FavoriteCount < b.FavoriteCount ? 1 : -1).slice(0, 10)

      return callback({
        restaurants: restaurants,
        isAuthenticated: req.isAuthenticated
      })
    })
  }
}

module.exports = restService