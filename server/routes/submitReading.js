const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')
const validInputs = require('../middleware/validinputs')

//add new totals

router.put('/', authorization, async (req, res) => {
    try {
        const { challenge_type, total, reader_id } = req.body
        console.log(req.body)
        if (challenge_type === 'books_read') {
            console.log('Update books read')
            const updateTotal = await pool.query(
                `UPDATE readers SET books_read = books_read + $1 WHERE id = $2 RETURNING *`,
                [total, reader_id]
            )
            res.json(updateTotal.rows[0].books_read)
        } else if (challenge_type === 'chapters_read') {
            console.log('Update chapters read')
            const updateTotal = await pool.query(
                `UPDATE readers SET chapters_read = chapters_read + $1 WHERE id = $2 RETURNING *`,
                [total, reader_id]
            )
            res.json(updateTotal.rows[0].chapters_read)
        } else {
            console.log('Update verses memorized')
            const updateTotal = await pool.query(
                `UPDATE readers SET verses_memorized = verses_memorized + $1 WHERE id = $2 RETURNING *`,
                [total, reader_id]
            )
            res.json(updateTotal.rows[0].verses_memorized)
        }
    } catch (err) {
        console.error(err.message)
    }
})

//

module.exports = router
