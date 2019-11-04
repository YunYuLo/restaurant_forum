//include database
const db = require('../models')
const Category = db.Category

let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll()
      .then(categories => {
        return res.render('admin/categories', { categories })
      })
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_message', 'name did not exist.')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          res.redirect('/admin/categories')
        })
    }
  }
  //getCategory: (req, res) => {},
  //putCategory: (req, res) => {},
  //deleteCategory: (req, res) => {},
}

module.exports = categoryController