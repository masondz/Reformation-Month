const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')

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
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.user_password,
                req.body.chapters_read,
                req.body.books_read,
                req.body.verses_memorized,
                req.user,
            ]
        )
        res.json(updateReader.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})
//Delete reader
router
module.exports = router
