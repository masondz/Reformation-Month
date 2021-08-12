const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')



router.get('/', authorization, async (req, res) => {
    try {
        const { reader_id } = req.body
        const getAdReaders = await pool.query(
            `
      SELECT name, chapters_read, books_read, verses_memorized, ad_reader_id FROM additional_readers WHERE reader_id = $1 ORDER BY name;`,
            [reader_id]
        )
        if (getAdReaders.rows === 0) {
            res.status(401).json('You do not have any additional readers!')
        }
        res.json(getAdReaders.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create additional reader. Must go into additional_reader, 

router.post('/', authorization, async (req, res) => {
    try {
        //check if reader has additional_reader with named that already
        const { name } = req.body
        const makeAdReader = await pool.query(
            `INSERT INTO additional_readers (
      name, chapters_read, books_read, verses_memorized) VALUES($1, 0, 0, 0) RETURNING ad_reader_id;`,
            [name]
        )
        const parseRes = await res.json(makeAdReader.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

router.put('/', authorization, async (req, res) => {
    try {
        const { chapters_read, books_read, verses_memorized, ad_reader_id } =
            req.body
        const updateAdReader = await fetch(
            `UPDATE additional_readers SET chapters_read = $1, books_read = $2, verses_memorized = $3, WHERE ad_reader_id=$4;`,
            [chapters_read, books_read, verses_memorized, ad_reader_id]
        )
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router
