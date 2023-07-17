const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)



const localFileHandler = file => {
    return new Promise((resolve, rejects) => {
        if (!file) return resolve(null)

        const fileName = `upload/${file.originalname}`
        return fs.promises.readFile(file.path)
            .then(data => fs.promises.writeFile(fileName, data))
            .then(() => resolve(`/${fileName}`))
            .catch(err => rejects(err))
    })
}

const imgurFileHandler = file => {

    return new Promise((resolve, rejects) => {
        if (!file) return resolve(null)

        return imgur.uploadFile(file.path)
            .then(img => resolve(img?.link || null))
            .catch(err => rejects(err))
    })
}


module.exports = {
    localFileHandler,
    imgurFileHandler
}