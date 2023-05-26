const { Restaurant, Category, Comment, User } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const restaurantServices = require('../../services/restaurant-services')

const restaurantsController = {
    getRestaurants: (req, res, next) => {
        restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))

    },
    getRestaurant: (req, res, next) => {
        Restaurant.findByPk(req.params.id, {
            include: [
                Category,
                { model: Comment, include: User },
                { model: User, as: 'FavoritedUsers' },
                { model: User, as: 'LikedUsers' }
            ],
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                return restaurant.increment('viewCount')

            })
            .then(restaurant => {
                const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
                // const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
                const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
                res.render('restaurant', {
                    restaurant: restaurant.toJSON(),
                    isFavorited,
                    isLiked
                })
            })
            .catch(err => next(err))
    },
    getDashboard: (req, res, next) => {
        Restaurant.findByPk(req.params.id, {
            include: Category,
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                res.render('dashboard', { restaurant: restaurant.toJSON() })
            })
            .catch(err => next(err))
    },
    getFeeds: (req, res, next) => {
        Promise.all([
            Restaurant.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: [Category],
                raw: true,
                nest: true
            }),
            Comment.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: [User, Restaurant],
                raw: true,
                nest: true
            })
        ])
            .then(([restaurants, comments]) => {
                res.render('feeds', {
                    restaurants,
                    comments
                })
            })
            .catch(err => next(err))
    },
    getTopRestaurants: (req, res, next) => {

        Restaurant.findAll({
            include: [
                { model: User, as: 'FavoritedUsers' }
            ]
        })
            .then(restaurants => {
                restaurants = restaurants.map(restaurant => ({
                    ...restaurant.toJSON(),
                    description: restaurant.description.substring(0, 50),
                    favoritesCount: restaurant.FavoritedUsers.length,
                    isFavorited: req.user && req.user.FavoritedRestaurants.map(d => d.id).includes(restaurant.id)
                }))
                restaurants.sort((a, b) => b.favoritesCount - a.favoritesCount)
                restaurants = restaurants.slice(0, 10)
                res.render('top-restaurants', { restaurants })
            })
            .catch(err => next(err))
    },

}

module.exports = restaurantsController