const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header('token')

        if (jwtToken.length === 0) {
            return res.status(403).json('Token messe up: Not Authorized')
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret) //chekcs if the jwt Token is valid

        req.user = payload.user
    } catch (err) {
        console.error(err.message)
        res.status(403).json('Not Authorized, not the token i guess')
    }
    next() //don't forget this, otherwise the GET request in jwtAuth for is-verify route won't advance.
}
