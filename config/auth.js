module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  },
  authenticatedUser: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.id == req.params.id) {
        return next()
      }
      req.flash('error_messages', 'Authentication error!')
      return res.redirect(`/users/${req.user.id}`)
    }
  }
}