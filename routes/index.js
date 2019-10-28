const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

module.exports = app => {
  //index page
  app.get('/', (req, res) => res.redirect('/restaurants'))
  //restController
  app.get('/restaurants', restController.getRestaurants)


  // app.get('/restaurants/top', restController.getTopRestaurants)
  // app.get('/restaurants/feeds', restController.getFeeds)
  // app.get('/restaurants/:id', restController.getRestaurant)
  // app.get('/restaurants/:id/dashboard', restController.getDashboard)

  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', (req, res) => res.render('/admin/restaurants'))
  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', adminController.getRestaurants)

  //user sing up
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

}