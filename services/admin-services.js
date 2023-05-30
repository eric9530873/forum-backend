const { Restaurant, User, Category } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')


const adminServices = {
    getRestaurants: (req, cb) => {
        Restaurant.findAll({
            raw: true,
            nest: true,
            include: [Category]
        })
            .then(restaurants => cb(null, { restaurants }))
            .catch(err => cb(err))
    }
}

module.exports = adminServices