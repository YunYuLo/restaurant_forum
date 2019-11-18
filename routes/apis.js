const express = require('express')
const router = express.Router()
// 引入 multer 並設定上傳資料夾 
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })
function authenticate(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(401).json({ status: 'error', message: "No auth token" });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

const authenticated = authenticate
const { apiAuthenticatedAdmin } = require('../config/auth')

const restController = require('../controllers/api/restController.js')
const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')
const commentController = require('../controllers/api/commentController.js')

// restController
router.get('/', authenticated, (req, res) => res.redirect('/api/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// commentController
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticated, apiAuthenticatedAdmin, commentController.deleteComment)

// users ,favorite, like, following
router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// admin/restaurants
router.get('/admin/restaurants', authenticated, apiAuthenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticated, apiAuthenticatedAdmin, adminController.createRestaurant)
router.get('/admin/restaurants/:id', authenticated, apiAuthenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticated, apiAuthenticatedAdmin, adminController.editRestaurant)

router.delete('/admin/restaurants/:id', authenticated, apiAuthenticatedAdmin, adminController.deleteRestaurant)
router.post('/admin/restaurants', authenticated, apiAuthenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', authenticated, apiAuthenticatedAdmin, upload.single('image'), adminController.putRestaurant)

// admin/categories
router.get('/admin/categories', authenticated, apiAuthenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, apiAuthenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticated, apiAuthenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticated, apiAuthenticatedAdmin, categoryController.deleteCategory)

// admin/users
router.get('/admin/users', authenticated, apiAuthenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id', authenticated, apiAuthenticatedAdmin, adminController.putUsers)


// JWT signin
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

module.exports = router