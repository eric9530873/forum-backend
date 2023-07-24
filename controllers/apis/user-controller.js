const jwt = require('jsonwebtoken')
const userServices = require('../../services/user-services')

const userController = {
    signIn: (req, res, next) => {
        try {
            const userData = req.user.toJSON()
            const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
            res.json({
                status: 'success',
                data: {
                    token,
                    user: userData
                }
            })
        } catch (err) {
            next(err)
        }

    },
    signUp: (req, res, next) => {
        userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    getUser: (req, res, next) => {
        userServices.getUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    getTopUser: (req, res, next) => {
        userServices.getTopUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    putUser: (req, res, next) => {
        userServices.putUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    addFavorite: (req, res, next) => {
        userServices.addFavorite(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    removeFavorite: (req, res, next) => {
        userServices.removeFavorite(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    addLiked: (req, res, next) => {
        userServices.addLiked(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    removeLiked: (req, res, next) => {
        userServices.removeLiked(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    addFollowing: (req, res, next) => {
        userServices.addFollowing(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    removeFollowing: (req, res, next) => {
        userServices.removeFollowing(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    getCurrentUser: (req, res) => {
        return res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            image: req.user.image,
            isAdmin: req.user.isAdmin
        })
    }
}

module.exports = userController