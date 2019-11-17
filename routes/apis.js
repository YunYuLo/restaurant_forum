const express = require('express')
const router = express.Router()
// 引入 multer 並設定上傳資料夾 
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })
const { apiAuthenticatedAdmin } = require('../config/auth')

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')

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

// JWT signin
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

module.exports = router