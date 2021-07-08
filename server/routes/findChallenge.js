const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')

router.get('/', authorization, async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM reading_challenges')
        res.json(user.rows)
    } catch (err) {
        console.log(err.message)
    }
})

module.exports = router
