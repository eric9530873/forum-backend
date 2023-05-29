const adminController = {
    getRestaurants: (req, res, next) => {
        Restaurant.findAll({
            raw: true,
            include: [Category],
            nest: true
        })
            .then(restaurants => res.render('admin/restaurants', { restaurants: restaurants }))
            .catch(err => next(err))
    }
}

module.exports = adminController