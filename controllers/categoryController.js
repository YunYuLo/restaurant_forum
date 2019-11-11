//include database
const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryServices.js')

let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', (data))
    })
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
    // if (!req.body.name) {
    //   req.flash('error_messages', 'Name did not exist.')
    //   return res.redirect('back')
    // } else {
    //   return Category.findByPk(req.params.id)
    //     .then((category) => {
    //       category.update(req.body)
    //         .then((category) => {
    //           res.redirect('/admin/categories')
    //         })
    //     })
    // }
  },
  //getCategory: (req, res) => {},
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  },
}

module.exports = categoryController