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

router.get('/find-challenges', authorization, async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM reading_challenges')
        res.json(user.rows)
    } catch (err) {
        console.log(err.message)
    }
})

//add challenge to user's profile
router.post('/find-challenges', authorization, async (req, res) => {
    try {
        const { challenge_name, id, organization, readers_id } = body
        const addChallengeToReader = await pool.query()
        if (addChallengeToReader.rows.length !== 0) {
            // check if reader_id is already assigned to challenge
            return res.status(401).json('You are already in this Challenge.')
        }
    } catch (error) {}
})

module.exports = router
