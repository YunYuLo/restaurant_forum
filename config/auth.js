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
  },
  // apis
  apiAuthenticatedAdmin: (req, res, next) => {
    if (req.user) {
      if (req.user.isAdmin) { return next() }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  }
}