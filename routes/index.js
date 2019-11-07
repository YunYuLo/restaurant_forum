const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  const { authenticated, authenticatedAdmin, authenticatedUser } = require('../config/auth')

  //index page
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  //restController
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)


  // comment
  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  // app.get('/restaurants/top', restController.getTopRestaurants)
  // app.get('/restaurants/:id', restController.getRestaurant)

  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.render('/admin/restaurants'))

  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  // users
  app.get('/users/top', authenticated, userController.getTopUser)
  app.get('/users/:id', authenticatedUser, adminController.getUser)
  app.get('/users/:id/edit', authenticatedUser, adminController.editUser)
  app.put('/users/:id', authenticatedUser, upload.single('image'), adminController.putUser)

  // admin/users
  app.get('/admin/users', authenticatedAdmin, adminController.editUsers)
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)


  // admin/categories
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)



  //user sing up, sign in, logout
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate(
    'local',
    {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  )
  app.get('/logout', userController.logout)

  //favorite
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

  //Like
  app.post('/like/:restaurantId', authenticated, userController.addLike)
  app.delete('/like/:restaurantId', authenticated, userController.removeLike)

  //followship
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)

}