const express = require('express')
const router = express.Router()
const restaurantsController = require('../../controllers/apis/restaurants-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/restaurants', restaurantsController.getRestaurants)

module.exports = router