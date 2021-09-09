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

//add additional_readers to reading challenges

router.post('/add-additional-reader', authorization, (req, res) => {
    try {
        //add adreader based on what challenge reader is in.
        const { reader_id, ad_reader_id } = req.body;
        const adddAdReader = pool.query(
            `INSERT INTO adreaders_reding_challenges (ad_reader_id, challenge_id)
             SELECT $1, reading_challenges.id FROM reading_challenges 
             JOIN readers_reading_challenges
                ON reading_challenges.id = readers_reading_challenges.challenge_id
             JOIN readers
                ON readers_reading_challenges.readers.id = readers.id
                WHERE readers.id = $2
                ON CONFLICT DO NOTHING`,
            [ad_reader_id, reader_id]
        );
        return res.json(addAdReader);
        
//         //check if additional_reader is already in challenge
//         const checkAdReader = pool.query(
//             `SELECT * FROM adreaders_reading_challenges WHERE ad_reader_id = $1 AND challenge_id = $2`,
//             [ad_reader_id, challenge_id]
//         )
//         const parsRes = res.json(checkAdReader)
//         console.log(parsRes)
//         if (checkAdReader.rowCount > 0) {
//             return console.log('addtional reader is already in challenge')
//         } else {
//             console.log('adding additional_reader')
//         }

//         const addAdReader = pool.query(
//             'INSERT INTO adreaders_reading_challenges (ad_reader_id, challenge_id) VALUES ($1, $2)',
//             [ad_reader_id, challenge_id]
//         )
//         return res.json(addAdReader)
        
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router
