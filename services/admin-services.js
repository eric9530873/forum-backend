const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')



const adminServices = {
    getRestaurants: (req, cb) => {
        Restaurant.findAll({
            raw: true,
            nest: true,
            include: [Category]
        })
            .then(restaurants => cb(null, { restaurants }))
            .catch(err => cb(err))
    },
    deleteRestaurant: (req, cb) => {
        Restaurant.findByPk(req.params.id)
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist!")

                return restaurant.destroy()
            })
            .then((deleteRestaurant) => cb(null, { restaurant: deleteRestaurant }))
            .catch(err => cb(err))
    },
    postRestaurant: (req, cb) => {
        if (!req.body.name) throw new Error('Restaurant name is required')

        imgurFileHandler(req.file).then(filePath => {
            return Restaurant.create({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                openingHours: req.body.openingHours,
                description: req.body.description,
                image: filePath || null,
                categoryId: req.body.categoryId
            })
        })
            .then((newRestaurant) => {
                cb(null, { restaurant: newRestaurant })
            })
            .catch(err => cb(err))
    },
    putRestaurant: (req, cb) => {

        Promise.all([
            Restaurant.findByPk(req.params.id),
            imgurFileHandler(req.file)
        ])
            .then(([restaurant, filePath]) => {
                if (!restaurant) throw new Error("Restaurant didn't exist")

                return restaurant.update({
                    name: req.body.name,
                    tel: req.body.tel,
                    address: req.body.address,
                    openingHours: req.body.openingHours,
                    description: req.body.description,
                    image: filePath || restaurant.image,
                    categoryId: req.body.categoryId
                })
            })
            .then((restaurant) => {
                cb(null, restaurant)
            })
            .catch(err => cb(err))
    },
    getUsers: (req, cb) => {
        User.findAll({ raw: true })
            .then((users) => cb(null, users))
            .catch(err => cb(err))
    },
    PutUsers: (req, cb) => {
        User.findByPk(req.params.id)
            .then(user => {
                if (!user) throw new Error("User didn't exist!")
                if (user.email === 'root@example.com') {
                    req.flash('error_messages', '禁止變更 root 權限')
                    return res.redirect('back')
                }

                return user.update({
                    isAdmin: !user.isAdmin
                })
            })
            .then((user) => {
                cb(null, user)
            })
            .catch(err => cb(err))
    }
}

module.exports = adminServices