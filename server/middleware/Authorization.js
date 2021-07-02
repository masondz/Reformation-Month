const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async (req, res, next) => {
    try {
        const jwToken = req.header('token')

        if (!jwtToke) {
            return res.status(403).json('Not Authorized')
        }

        const payload = jwt.verify
    } catch (err) {
        console.error(err.message)
        res.status(403).json('Not Authorized')
    }
}
