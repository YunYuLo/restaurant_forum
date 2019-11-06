const moment = require('moment')
module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (a) {
    return moment(a).fromNow()
  },
  sumEach: function (a) {
    if (a.length == 0) return 0
    return a.length
  }
}