const { Comment } = require('../models')

const commentServices = {
    // postComment: (req, cb) => {
    //     if (!req.body.text) throw new Error('Comment text is require')

    //     Promise.all([
    //         User.findByPk(req.user.id),
    //         Restaurant.findByPk(req.body.restaurantId)
    //     ])
    //         .then(([user, restaurant]) => {
    //             if (!user) throw new Error("User didn't exist")
    //             if (!restaurant) throw new Error("Restaurant didn't exist")

    //             return Comment.create({
    //                 text: req.body.text,
    //                 restaurantId: req.body.restaurantId,
    //                 userId: req.user.id
    //             })
    //         })
    //         .then((comment) => {
    //             cb(null, comment)
    //         })
    //         .catch(err => next(err))
    // },
    deleteComment: (req, cb) => {
        Comment.findByPk(req.params.id)
            .then(comment => {
                if (!comment) throw new Error("Comment didn't exist")

                return comment.destroy()
            })
            .then((deleteComment) => cb(null, deleteComment))
            .catch(err => cb(err))
    },
    postComment: (req, cb) => {
        if (!req.body.text) throw new Error('Comment text is require')
        return Comment.create({
            text: req.body.text,
            RestaurantId: req.body.restaurantId,
            UserId: req.user.id
        })
            .then((comment) => {
                console.log('comment', comment)
                return cb({
                    status: 'success',
                    message: 'created new comment successfully',
                    RestaurantId: comment.RestaurantId,
                    commentId: comment.id
                })
            })
            .catch(err => cb(err))
    }
}

module.exports = commentServices