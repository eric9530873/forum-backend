const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')


router.get('/restaurants', adminController.getRestaurants)
router.delete('/restaurant/:id', adminController.deleteRestaurant)

module.exports = router