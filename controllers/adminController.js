//include database
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const Comment = db.Comment
const FollowShip = db.Followship
//include image middleware
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '3824fb3f338cad3'

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ include: [Category] })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },
  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', { categories })
    })

  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "Name did not exist.")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.CategoryId
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.CategoryId
      })
        .then((restaurant) => {
          req.flash('success_messages', "Restaurant was successfully created.")
          res.redirect('/admin/restaurants')
        })
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll()
        .then(categories => {
          return res.render('admin/create', { restaurant, categories })
        })

    })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.CategoryId
            }).then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.CategoryId
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },

  //User function/////////////////////////////
  editUsers: (req, res) => {
    return User.findAll().then(users => {
      return res.render('admin/users', { users })
    })
  },
  putUsers: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user.update({ isAdmin: !user.isAdmin })
        .then(user => {
          req.flash('success_messages', `${user.name} was successfully to update.`)
          res.redirect('/admin/users')
        })
    })
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoriteRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then((user) => {
        const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
        const authenticatedUser = req.user.id

        //return unique comments array
        const userComments = user.dataValues.Comments
        const uniqueComments = userComments.map(e => e.Restaurant.id).map((e, i, final) => final.indexOf(e) === i && i).filter((e) => userComments[e]).map(e => userComments[e])
        // console.log(uniqueComments)
        return res.render('user', { user, isFollowed, authenticatedUser, uniqueComments })
      })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        return res.render('editUser', { user })
      })
  },
  putUser: (req, res) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image,
            }).then((user) => {
              req.flash('success_messages', `${user.name} was successfully to update.`)
              res.redirect(`/users/${user.id}`)
            })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image
          }).then((user) => {
            req.flash('success_messages', `${user.name} was successfully to update.`)
            res.redirect(`/users/${user.id}`)
          })
        })
    }
  },
}

module.exports = adminController