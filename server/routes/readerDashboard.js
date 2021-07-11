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
//Leave challenge
router.delete('/:reader_challenge_id', authorization, async (req, res) => {
    try {
        const reader_reading_challenge = req.params.reader_challenge_id
        console.log(
            `This route is meant to delete reader_reading_challenge entry: ${reader_reading_challenge}`
        )
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router