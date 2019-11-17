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
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminServices.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: (req, res) => {
    adminService.createRestaurant(req, res, (data) => {
      return res.render('admin/create', data)
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      res.render('admin/restaurant', (data))
    })
  },
  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, (data) => {
      return res.render('admin/create', (data))
    })
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  //User function/////////////////////////////
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      return res.render('admin/users', data)
    })
  },
  putUsers: (req, res) => {
    adminService.putUsers(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/users')
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

        //return unique comments array
        const userComments = user.dataValues.Comments
        const uniqueComments = userComments.map(e => e.Restaurant.id).map((e, i, final) => final.indexOf(e) === i && i).filter((e) => userComments[e]).map(e => userComments[e])
        console.log(req.user)
        return res.render('user', { user, isFollowed, uniqueComments })
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