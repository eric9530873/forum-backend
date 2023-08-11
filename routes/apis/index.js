const express = require('express')
const router = express.Router()
const passport = require('passport')
const cors = require('cors')
app.options('*', cors())

const admin = require('./modules/admin')

const restaurantsController = require('../../controllers/apis/restaurants-controller')
const userController = require('../../controllers/apis/user-controller')
const commentController = require('../../controllers/apis/commet-controller')

const upload = require('../../middleware/multer')

const { authenticated, authenticatedAdmin } = require('../../middleware/apiAuth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.get('/get_current_user', authenticated, userController.getCurrentUser)

router.get('/restaurants/feeds', authenticated, restaurantsController.getFeeds)
router.get('/restaurants/top', authenticated, restaurantsController.getTopRestaurants)
router.get('/restaurants/:id/dashboard', authenticated, restaurantsController.getDashboard)
router.get('/restaurants/:id', authenticated, restaurantsController.getRestaurant)
router.get('/restaurants', authenticated, restaurantsController.getRestaurants)

router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.delete('/comments/:id', authenticated, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.delete('/favorite/:id', authenticated, userController.removeFavorite)
router.post('/favorite/:id', authenticated, userController.addFavorite)

router.delete('/like/:id', authenticated, userController.removeLiked)
router.post('/like/:id', authenticated, userController.addLiked)

router.delete('/following/:id', authenticated, userController.removeFollowing)
router.post('/following/:id', authenticated, userController.addFollowing)

router.post('/signup', cors(), userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/', apiErrorHandler)

module.exports = router