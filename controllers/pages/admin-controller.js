const { Restaurant, User, Category } = require('../../models')
const { localFileHandler } = require('../../helpers/file-helpers')

const adminServices = require('../../services/admin-services')

const adminController = {
    getRestaurants: (req, res, next) => {
        adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', data))
    },
    createRestaurant: (req, res, next) => {
        Category.findAll({
            raw: true
        })
            .then(categories => res.render('admin/create-restaurant', { categories }))
            .catch(err => next(err))
    },
    postRestaurant: (req, res, next) => {
        if (!req.body.name) throw new Error('Restaurant name is required')

        localFileHandler(req.file).then(filePath => {
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
            .then(() => {
                req.flash('success_msg', 'restaurant was successfully created')
                res.redirect('/admin/restaurants')
            })
            .catch(err => next(err))
    },
    getRestaurant: (req, res, next) => {
        Restaurant.findByPk(req.params.id, {
            raw: true,
            nest: true,
            include: [Category]
        })
            .then(restaurant => {
                if (!restaurant) throw new Error("Restaurant didn't exist")
                res.render('admin/restaurant', { restaurant })
            })
            .catch(err => next(err))
    },
    editRestaurant: (req, res, next) => {
        Promise.all([
            Restaurant.findByPk(req.params.id, { raw: true }),
            Category.findAll({ raw: true })
        ])
            .then(([restaurant, categories]) => {
                if (!restaurant) throw new Error("Restaurant didn't exist")
                res.render('admin/edit-restaurant', { restaurant, categories })
            })
            .catch(err => next(err))
    },
    putRestaurant: (req, res, next) => {

        Promise.all([
            Restaurant.findByPk(req.params.id),
            localFileHandler(req.file)
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
            .then(() => {
                req.flash('success_msg', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
            })
            .catch(err => next(err))
    },
    deleteRestaurant: (req, res, next) => {
        adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.redirect('admin/restaurants', data))
    },
    getUsers: (req, res, next) => {
        User.findAll({ raw: true })
            .then((users) => res.render('admin/users', { users }))
            .catch(err => next(err))
    },
    PutUsers: (req, res, next) => {
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
            .then(() => {
                req.flash('success_messages', '使用者權限變更成功')
                res.redirect('/admin/users')
            })
            .catch(err => next(err))
    }
}

module.exports = adminController