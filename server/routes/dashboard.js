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

router.get(
    '/find-challenges/:challenge_name',
    authorization,
    async (req, res) => {
        try {
            const challengeName = req.params.challenge_name
            const challenge = await pool.query(
                'SELECT * FROM reading_challenges WHERE challenge_name=$1',
                [challengeName]
            )
            res.json(challenge.rows)
        } catch (err) {
            console.log(err.message)
        }
    }
)

//add reader(id) to readers_reading_challenges
router.post('/find-challenges', authorization, async (req, res) => {
    try {
        const { reader_id, challenge_id } = req.body
        const readerToAdd = await pool.query(
            'SELECT * FROM readers_reading_challenges WHERE reader_id= $1',
            [reader_id]
        )
        if (readerToAdd.rows.challenge_id === challenge_id) {
            // check if reader_id is already assigned to challenge
            return res
                .status(401)
                .json(`You are already in this Challenge ${challenge_id}`)
        }
        await pool.query(
            `INSERT INTO readers_reading_challenges (
            reader_id,
            challenge_id,
            role
        )
        VALUES ($1, $2, 0)`,
            [reader_id, challenge_id]
        )
    } catch (err) {
        res.status(500).send(err.message)
    }

    //get reading challenges of the logged in user!
})

module.exports = router
