const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')

router.get('/', authorization, async (req, res) => {
    try {
        //req.user has the payload
        // res.json(req.user)

        const user = await pool.query(
            'SELECT first_name, last_name, chapters_read, books_read, verses_memorized, id FROM readers WHERE id = $1',
            [req.user]
        )
        res.json(user.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json('Server Error')
    }
})

module.exports = router
