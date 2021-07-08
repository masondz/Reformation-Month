const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')

//get every challenge
router.get('/', authorization, async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM reading_challenges')
        res.json(user.rows)
    } catch (err) {
        console.log(err.message)
    }
})

//get single challenges
router.get('/:challenge_name', authorization, async (req, res) => {
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
})

//add reader(id) to readers_reading_challenges
router.post('/', authorization, async (req, res) => {
    try {
        const { reader_id, challenge_id } = req.body

        const readerToAdd = await pool.query(
            'SELECT * FROM readers_reading_challenges WHERE reader_id= $1 AND challenge_id=$2',
            [reader_id, challenge_id]
        )
        if (readerToAdd.rows.lentght !== 0) {
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
        console.log(err.message)
    }
})

module.exports = router
