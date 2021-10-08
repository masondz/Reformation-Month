//the ad_reader_id will be sent via req.body as reader_id; must set it to ad_reader_id:

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
        //check if additional reader has a name
        const { name, reader_id } = req.body
        if (!name) {
            return res.status(401).send('New reader must have a name!')
        }

        const makeAdReader = await pool.query(
            `INSERT INTO additional_readers (
      name, chapters_read, books_read, verses_memorized, reader_id) VALUES($1, 0, 0, 0, $2) RETURNING ad_reader_id;`,
            [name, reader_id]
        )
        if (makeAdReader.rows === 0) {
            return res.status(401).send('Error with server!')
        }

        const ad_reader_id = makeAdReader.rows[0].ad_reader_id

        const addAdReader = pool.query(
            `INSERT INTO adreaders_reading_challenges (ad_reader_id, challenge_id)
            SELECT $1, reading_challenges.id FROM reading_challenges 
            INNER JOIN readers_reading_challenges
               ON reading_challenges.id = readers_reading_challenges.challenge_id
            INNER JOIN readers
               ON readers_reading_challenges.reader_id = readers.id
               WHERE readers.id = $2
               ON CONFLICT DO NOTHING`,
            [ad_reader_id, reader_id]
        )
        console.log(addAdReader)

        res.status(201).json(makeAdReader.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//update additional reader's stats
// router.put('/', authorization, async (req, res) => {
//     try {
//         const { chapters_read, books_read, verses_memorized, ad_reader_id } =
//             req.body
//         const updateAdReader = await pool.query(
//             `UPDATE additional_readers SET chapters_read = $1, books_read = $2, verses_memorized = $3 WHERE ad_reader_id=$4 RETURNING *;`,
//             [chapters_read, books_read, verses_memorized, ad_reader_id]
//         )
//         const parseRes = await res.json(updateAdReader.rows[0])
//         console.log(parseRes)
//     } catch (err) {
//         console.error(err.message)
//     }
// })

router.put('/', authorization, async (req, res) => {
    try {
        const { challenge_type, total, ad_reader_id } = req.body
        console.log(req.body)
        if (challenge_type === 'books_read') {
            console.log('Update books read')
            const updateTotal = await pool.query(
                `UPDATE additional_readers SET books_read = books_read + $1 WHERE ad_reader_id = $2 RETURNING *`,
                [total, ad_reader_id]
            )
            res.json(updateTotal.rows[0].books_read)
        } else if (challenge_type === 'chapters_read') {
            console.log('Update chapters read')
            const updateTotal = await pool.query(
                `UPDATE additional_readers SET chapters_read = chapters_read + $1 WHERE ad_reader_id = $2 RETURNING *`,
                [total, ad_reader_id]
            )
            res.json(updateTotal.rows[0].chapters_read)
        } else {
            console.log('Update verses memorized')
            const updateTotal = await pool.query(
                `UPDATE additional_readers SET verses_memorized = verses_memorized + $1 WHERE ad_reader_id = $2 RETURNING *`,
                [total, ad_reader_id]
            )
            res.json(updateTotal.rows[0].verses_memorized)
        }
    } catch (err) {
        console.error(err.message)
    }
})

// change additional reader's name
router.put('/change-add-reader-name', authorization, async (req, res) => {
    try {
        const { name, ad_reader_id } = req.body
        req.body // does this need to be deleted?
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
        const { reader_id, ad_reader_id, fg_id } = req.body
        console.log(reader_id)
        console.log(ad_reader_id)
        //check if reader is creator of adreader
        const getReader = await pool.query(
            `SELECT * FROM additional_readers WHERE ad_reader_id = $1 AND reader_id = $2`,
            [ad_reader_id, reader_id]
        )
        // console.log(getReader)
        if (getReader.rowCount === 0) {
            return res
                .status(403)
                .json('You must be the creator of reader to delete reader.')
        }
        res.json(getReader)
        // console.log(getReader)
        const deleteAdReader = await pool.query(
            `DELETE FROM additional_readers WHERE ad_reader_id = $1 AND reader_id = $2`,
            [ad_reader_id, reader_id]
        )
        //remove from family group
        const removeAdReader = await pool.query(
            `UPDATE family_group SET additional_reader_ids = array_remove(additional_reader_ids, $1::uuid) WHERE id=$2 RETURNING additional_reader_ids`,
            [ad_reader_id, fg_id]
        )
        console.log(removeAdReader)
        res.json(deleteAdReader)
    } catch (err) {
        console.error(err.message)
    }
})

//get additional readers challenges
// => /additional-readers

router.get('/:adreader_id', authorization, async (req, res) => {
    try{
        const adreader_id = req.params.adreader_id
        const challenges = await pool.query(
            `SELECT rc.challenge_name, rc.challenge_id FROM reading_challenges rc
            INNER JOIN readers_reading_challenges rrc
            ON rrc.challenge_id = rc.challenge_id
            WHERE rrc.ad_reader_id = $1`,
            [adreader_id]
        )
        res.json(challenges.rows)
    } catch (err){
        console.log(err.message);
    }
})

module.exports = router
