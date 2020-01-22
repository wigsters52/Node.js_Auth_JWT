const router = require('express').Router()
// this is making it break and I am not sure why
// const verify = require('./verifyToken')
// the verify is making stuff break. I am getting Error: Route.get() requires a callback function but got a [object Object]
router.get('/' /*, verify */, (req, res) => {
  res.json({
    posts: {
      title: 'myfirst post',
      description: 'random data you shouldnt access'
    }
  })
})

module.exports = router
