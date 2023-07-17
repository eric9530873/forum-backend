const categoryServices = require('../../services/category-services')

const categoryController = {
    getCategories: (req, res, next) => {
        categoryServices.getCategories(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    postCategories: (req, res, next) => {
        categoryServices.postCategories(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    putCategories: (req, res, next) => {
        categoryServices.putCategories(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    deleteCategories: (req, res, next) => {
        categoryServices.deleteCategories(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    }
}

module.exports = categoryController