const { Category } = require('../models')

const categoryServices = {
    getCategories: (req, cb) => {
        Promise.all([Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
        ])

            .then((categories) => cb(null, categories))
            .catch(err => cb(err))
    },
    postCategories: (req, cb) => {
        if (!req.body.name) throw new Error('Category name is required')

        Category.create({
            name: req.body.name
        })
            .then((category) => cb(null, category))
            .catch(err => cb(err))
    },
    putCategories: (req, cb) => {
        if (!req.body.name) throw new Error("Category name is required")

        Category.findByPk(req.params.id)
            .then(category => {
                if (!category) throw new Error("Category didn't exist")

                return category.update({
                    name: req.body.name
                })
            })
            .then((category) => cb(null, category))
            .catch(err => cb(err))
    },
    deleteCategories: (req, cb) => {
        Category.findByPk(req.params.id)
            .then(category => {
                if (!category) throw new Error("Category didn't exist!")

                return category.destroy()
            })
            .then((category) => cb(null, category))
            .catch(err => cb(err))
    }
}

module.exports = categoryServices