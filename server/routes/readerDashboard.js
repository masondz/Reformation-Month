const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')
const bcrypt = require('bcrypt')

//Get reader
router.get('/', authorization, async (req, res) => {
    try {
        const reader = await pool.query(
            'SELECT first_name, last_name, chapters_read, books_read, verses_memorized, id FROM readers WHERE id = $1',
            [req.user]
        )
        res.json(reader.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json('Server Error')
    }
})

//Update reader
router.put('/', authorization, async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            user_password,
            chapters_read,
            books_read,
            verses_memorized,
        } = req.body
        //  bcrypt user password
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(user_password, salt) //it takes time to encrypt password, otherwise it returns and empty object( '{}' )?
        //also, the password lenght ( VARCHAR(#) ) in the database schema must be long enough to accomodate encrypted password

        const updateReader = await pool.query(
            `UPDATE readers SET 
        first_name = $1, 
        last_name = $2,
        email = $3, 
        user_password = $4, 
        chapters_read = $5, 
        books_read = $6, 
        verses_memorized = $7 
        WHERE id = $8
        RETURNING *`,
            [
                first_name,
                last_name,
                email,
                bcryptPassword,
                chapters_read,
                books_read,
                verses_memorized,
                req.user,
            ]
        )
        res.json(updateReader.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})
//Delete reader

router.delete('/', authorization, async (req, res) => {
    try {
        const deleteReader = await pool.query(
            `DELETE FROM readers
        WHERE id = $1`,
            [req.user]
        )
        res.status(202).json(`Reader Deleted`)
    } catch (err) {
        console.error(err.message)
    }
})

//Get reader's reading challenges
router.get('/reader-challenge-id/', authorization, async (req, res) => {
    try {
        const { reader_id } = req.query
        const getReadersChallenges = await pool.query(
            `
        SELECT challenge_name FROM reading_challenges ch, readers_reading_challenges rch
        WHERE ch.id = rch.challenge_id AND rch.reader_id = $1;`,
            [reader_id]
        )
        res.json(getReadersChallenges.rows)
        console.log(getReadersChallenges)
    } catch (err) {
        console.error(err.message)
    }
})

// Leave challenge
router.delete('/reader-challenge-id/', authorization, async (req, res) => {
    try {
        const { reader_id, challenge_id } = req.query
        console.log(req.query)
        const leaveChallenge = await pool.query(
            `
            DELETE FROM readers_reading_challenges WHERE reader_id = $1 AND challenge_id = $2
        `,
            [req.query.reader_id, req.query.challenge_id]
        )
        res.json(leaveChallenge)
        console.log(
            `This route is meant to delete reader_reading_challenge entry: ${req.query}`
        )
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router
