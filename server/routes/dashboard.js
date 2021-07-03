const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')

router.get('/', authorization, async (req, res) => {
    try {
        //req,user has the payload
        res.json(req.user)
    } catch (err) {
        console.error(err.message)
        res.status(500).json('Server Error')
    }
})

module.exports = router
