const { Comment, User, Restaurant } = require("../../models");
const commentServices = require('../../services/comment-services')

const commentController = {
    // postComment: (req, res, next) => {
    //     commentServices.postComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    // },
    postComment: (req, res, next) => {
        if (!req.body.text) throw new Error('Comment text is require')

        Promise.all([
            User.findByPk(req.user.id),
            Restaurant.findByPk(req.body.restaurantId)
        ])
            .then(([user, restaurant]) => {
                if (!user) throw new Error("User didn't exist")
                if (!restaurant) throw new Error("Restaurant didn't exist")

                return Comment.create({
                    text: req.body.text,
                    restaurantId: req.body.restaurantId,
                    userId: req.user.id
                })
            })
            .then(() => {
                res.json({ status: 'success', data })
            })
            .catch(err => next(err))
    },
    deleteComment: (req, res, next) => {
        commentServices.deleteComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    }
}

module.exports = commentController