const express = require('express')
const router = express.Router()
const restaurantsController = require('../../controllers/apis/restaurants-controller')
const admin = require('./modules/admin')

const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', admin)

router.get('/restaurants', restaurantsController.getRestaurants)

router.use('/', apiErrorHandler)

module.exports = router