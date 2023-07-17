const db = require('../models')
const { User, Restaurant, Comment, Favorite, Like, Followship } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')

const userServices = {
    signUp: (req, cb) => {
        if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match')

        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) throw new Error('Email already exists')

                return bcrypt.hash(req.body.password, 10)
            })
            .then(hash => User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            }))
            .then(user => cb(null, user))
            .catch(err => cb(err))
    },
    getUser: (req, cb) => {
        return User.findByPk(req.params.id, {
            include: [
                { model: Comment, include: Restaurant },
                { model: Restaurant, as: 'FavoritedRestaurants' },
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' }
            ]
        })
            .then(user => {
                if (!user) throw new Error("User didn't exist!")
                user = user.toJSON()

                user.commentedRestaurants = user.Comments && user.Comments.reduce((acc, c) => {
                    if (!acc.some(r => r.id === c.restaurantId)) {
                        acc.push(c.Restaurant)
                    }
                    return acc
                }, [])

                user.idMatch = Number(user.id) === req.user.id || false

                user.isFollowed = req.user.Followings.some(f => f.id === user.id)
                cb(null, user)
            })
            .catch(err => cb(err))
    },
    getTopUser: (req, cb) => {
        User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        })
            .then(users => {
                const result = users
                    .map(user => ({
                        ...user.toJSON(),
                        followerCount: user.Followers.length,
                        isFollowed: req.user.Followings.some(f => f.id === user.id)
                    }))
                    .sort((a, b) => b.followerCount - a.followerCount)
                cb(null, { users: result })
            })
            .catch(err => next(err))
    },
    putUser: (req, cb) => {
        if (Number(req.params.id) !== Number(req.user.id)) {
            res.cb({ status: 'error', message: 'permission denied' })
        }

        Promise.all([
            User.findByPk(req.params.id),
            imgurFileHandler(req.file)
        ])
            .then(([user, filePath]) => {
                if (!user) throw new Error("User didn't exist!")

                return user.update({
                    name: req.body.name,
                    image: filePath || user.image
                })
            })
            .then(user => cb(null, user))
            .catch(err => cb(err))
    },
    addFavorite: (req, cb) => {
        Promise.all([
            Restaurant.findByPk(req.params.id),
            Favorite.findOne({
                where: {
                    userId: req.user.id,
                    restaurantId: req.params.id
                }
            })
        ])
            .then(([restaurant, favorite]) => {
                if (!restaurant) throw new Error("Restaurant didn't exist")
                if (favorite) throw new Error('You have favorited this restaurant')

                return Favorite.create({
                    userId: req.user.id,
                    restaurantId: req.params.id
                })
            })
            .then((restaurant) => cb(null, restaurant))
            .catch(err => cb(err))
    },
    removeFavorite: (req, cb) => {
        Favorite.findOne({
            where: {
                userId: req.user.id,
                restaurantId: req.params.id
            }
        })
            .then(favorite => {
                if (!favorite) throw new Error("You haven't favorited this restaurant")

                return favorite.destroy()
            })
            .then((favorite) => cb(null, favorite))
            .catch(err => cb(err))
    },
    addLiked: (req, cb) => {
        Promise.all([
            Restaurant.findByPk(req.params.id),
            Like.findOne({
                where: {
                    userId: req.user.id,
                    restaurantId: req.params.id
                }
            })
        ])
            .then(([restaurant, like]) => {
                if (!restaurant) throw new Error("Restaurant didn't exist")
                if (like) throw new Error('You have liked this restaurant')

                return Like.create({
                    userId: req.user.id,
                    restaurantId: req.params.id
                })
            })
            .then((restaurant) => cb(null, restaurant))
            .catch(err => cb(err))
    },
    removeLiked: (req, cb) => {
        Like.findOne({
            where: {
                userId: req.user.id,
                restaurantId: req.params.id
            }
        })
            .then(like => {
                if (!like) throw new Error("You haven't liked this restaurant")

                return like.destroy()
            })
            .then((like) => cb(null, like))
            .catch(err => cb(err))
    },
    addFollowing: (req, cb) => {
        Promise.all([
            User.findByPk(req.params.id),
            Followship.findOne({
                where: {
                    followerId: req.user.id,
                    followingId: req.params.id
                }
            })
        ])
            .then(([user, followship]) => {
                if (!user) throw new Error("User didn't exist")
                if (followship) throw new Error('You are already following him')

                return Followship.create({
                    followerId: req.user.id,
                    followingId: req.params.id
                })
            })
            .then((user) => cb(null, user))
            .catch(err => cb(err))
    },
    removeFollowing: (req, cb) => {

        Followship.findOne({
            where: {
                followerId: req.user.id,
                followingId: req.params.id
            }
        })
            .then((followship) => {
                if (!followship) throw new Error("You haven't followed this user!")

                return followship.destroy()
            })
            .then((user) => cb(null, user))
            .catch(err => cb(err))
    }
}

module.exports = userServices