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
router.get('/reader-challenge-id', authorization, async (req, res) => {
    try {
        const getReadersChallenges = await pool.query(
            `
        SELECT challenge_name, organization, goal, challenge, id, challenge_admin FROM reading_challenges ch, readers_reading_challenges rch
        WHERE ch.id = rch.challenge_id AND rch.reader_id = $1 ORDER BY challenge_name;`,
            [req.user]
        )
        if (getReadersChallenges.rows === 0) {
            res.status(401).json('Reader has not joined any challenges yet!')
        }
        res.json(getReadersChallenges.rows)
    } catch (err) {
        console.error(err.message)
    }
})

// Leave challenge
router.delete('/reader-challenge-id/', authorization, async (req, res) => {
    try {
        const { reader_id, challenge_id } = req.query
        //check if in a family_group
        const checkFG = await pool.query(
            `SELECT fg.family_name FROM family_group fg
            INNER JOIN readers r
            ON r.id = fg.id
            WHERE r.id = $1`,
            [reader_id]
           )
        if (checkFG.rows === 0) { //just delete reader from challenge
            const leaveChallenge = await pool.query(
            `
            DELETE FROM readers_reading_challenges WHERE reader_id = $1 AND challenge_id = $2
            `,
            [reader_id, challenge_id]
        )
        return res.json(leaveChallenge)
        };
        
        //check if sibling readers are in reading challenge
        const checkSibs = await pool.query(
            `SELECT count(*) as the_count from readers_reading_challenges rrc
             WHERE rrc.reader_id IN (SELECT unnest(reader_ids)
                                    FROM family_group fg
                                    INNER JOIN readers r
                                    ON r.id = ANY(fg.reader_ids)
                                    WHERE r.id = $1)
              AND rrc.challenge_id = $2;`,
            [reader_id, challenge_id]
            );
        
        if (checkSibs > 1) {
             const leaveChallenge = await pool.query(
            `
            DELETE FROM readers_reading_challenges WHERE reader_id = $1 AND challenge_id = $2
            `,
            [reader_id, challenge_id]
        )
        return res.json(leaveChallenge)
        };
        }
        
        const removeAdReader = await pool.query(  // remove additional readers from additional_readers_reading_challege
            `DELETE FROM adreaders_reading_challenges arc
             WHERE arc.ad_reader_id IN (SELECT unnest(ad_reader_ids) 
                                   FROM family_group fg
                                   INNER JOIN readers r
                                   ON r.id = ANY(fg.reader_ids)
                                   WHERE r.id = $1)
             AND arc.challenge_id = $2;`,
            [reader_id, challenge_id]
        );
        
        console.log(removeAdReader);
        
        const leaveChallenge = await pool.query(
            `
            DELETE FROM readers_reading_challenges WHERE reader_id = $1 AND challenge_id = $2
            `,
            [reader_id, challenge_id]
        )
        res.json(leaveChallenge)
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router
