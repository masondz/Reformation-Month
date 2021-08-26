const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')

//get additional readers
router.get('/', authorization, async (req, res) => {
    try {
        // const { reader_id } = req.body
        const getAdReaders = await pool.query(
            `
            SELECT additional_readers.*
            FROM additional_readers
            INNER JOIN family_group
              ON (additional_readers.ad_reader_id = ANY(family_group.additional_reader_ids))
            JOIN readers
              ON (readers.id = ANY(family_group.reader_ids))
                WHERE readers.id = $1
                ORDER BY additional_readers.name;`,
            [req.user]
        )
        if (getAdReaders.rows === 0) {
            res.status(401).json('You do not have any additional readers!')
        }
        res.json(getAdReaders.rows)
        console.log(getAdReaders.rows)
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

//update additional reader's stats
router.put('/', authorization, async (req, res) => {
    try {
        const { chapters_read, books_read, verses_memorized, ad_reader_id } =
            req.body
        const updateAdReader = await pool.query(
            `UPDATE additional_readers SET chapters_read = $1, books_read = $2, verses_memorized = $3 WHERE ad_reader_id=$4 RETURNING *;`,
            [chapters_read, books_read, verses_memorized, ad_reader_id]
        )
        const parseRes = await res.json(updateAdReader.rows[0])
        console.log(parseRes)
    } catch (err) {
        console.error(err.message)
    }
})

// change additional reader's name
router.put('/change-add-reader-name', authorization, async (req, res) => {
    try {
        const { name, ad_reader_id } = req.body
        req.body
        const updateAdReaderName = await pool.query(
            `UPDATE additional_readers SET name = $1 WHERE ad_reader_id = $2 AND reader_id = $3 RETURNING name`,
            [name, ad_reader_id, req.user]
        )
        const parseRes = res.json(updateAdReaderName.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//delete additional reader
router.delete('/', authorization, async (req, res) => {
    try {
        const { reader_id, ad_reader_id } = req.body
        const deleteAdReader = await pool.query(
            `DELETE FROM additional_readers WHERE ad_reader_id = $1 AND reader_id = $2`,
            [ad_reader_id, reader_id]
        )
        res.json(deleteAdReader)
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router
