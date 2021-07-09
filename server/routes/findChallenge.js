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
        console.log(reader_id, challenge_id)

        //check if reader is already in challenge
        const readerToAdd = await pool.query(
            'SELECT * FROM readers_reading_challenges WHERE reader_id= $1 AND challenge_id=$2',
            [reader_id, challenge_id]
        )
        console.log(readerToAdd.rowCount)
        if (readerToAdd.rowCount > 0) {
            return res.status(401).json('User already exists.')
        }

        //AtM: Don't need to check if challenge exists.
        //Express recieves an invalid input syntax for uuid syntax for reading_challenges.id

        // add the user
        const addedUser = await pool.query(
            `INSERT INTO readers_reading_challenges (
            reader_id,
            challenge_id,
            role
        )
        VALUES ($1, $2, 0)`,
            [reader_id, challenge_id]
        )
        return res.json(addedUser)
    } catch (err) {
        console.log(err.message)
        res.status(400).json('Challenge does not exists')
    }
})

module.exports = router
