const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')
const validInputs = require('../middleware/validinputs')

//create challenge
router.post('/', authorization, validInputs, async (req, res) => {
    try {
        const {
            challenge_name,
            organization,
            challenge_type,
            challenge_admin,
            goal,
            reader_id,
        } = req.body
        //check if challenge already exists.
        const challengeExist = await pool.query(
            `SELECT challenge_name FROM reading_challenges WHERE challenge_name = $1`,
            [challenge_name]
        )
        if (challengeExist.rowCount > 0) {
            return res
                .status(401)
                .json(`Reading challenge ${challenge_name} already exists.`)
        }

        const challengeToAdd = await pool.query(
            `INSERT INTO reading_challenges (
                challenge_name, 
                organization, 
                challenge, 
                challenge_admin,
                goal)
                
                VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [challenge_name, organization, challenge_type, req.user, goal]
        )
        //add aditional readers to challenge
        console.log(challengeToAdd)
        res.json(challengeToAdd.rows[0])
    } catch (err) {
        console.error(err.message)
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
        console.error(err.message)
    }
})

//update challenge
router.put('/', authorization, async (req, res) => {
    try {
        const {
            reader_id,
            challenge_name,
            organization,
            challenge_type,
            goal,
            id,
        } = req.body
        //check if challenge exists
        const challengeExist = await pool.query(
            `SELECT challenge_name, challenge_admin FROM reading_challenges WHERE challenge_name = $1`,
            [challenge_name]
        )
        if (challengeExist.rowCount !== 0) {
            // return res
            console.log('same name')
            // pass
            // .status(401)
            // .json(`Reading challenge ${challenge_name} already exists.`)
        } else if (challengeExist.rows[0].challenge_admin !== reader_id) {
            return res
                .status(403)
                .json(
                    `You are not authorized to update challenge ${challenge_name}`
                )
        }

        //udate challenge
        const updateChallenge = await pool.query(
            //cannont change admin
            `UPDATE reading_challenges 
            SET challenge_name = $1,
                organization = $2,
                challenge = $3,
                goal = $4
            WHERE id = $5 RETURNING *`,
            [challenge_name, organization, challenge_type, goal, id]
        )
        res.json(updateChallenge.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//delete challenge
router.delete('/', authorization, async (req, res) => {
    try {
        const { reader_id, challenge_name } = req.body
        console.log(reader_id, challenge_name)
        //check if challenge exists
        const challengeExist = await pool.query(
            `SELECT challenge_name, challenge_admin FROM reading_challenges WHERE challenge_name = $1`,
            [challenge_name]
        )
        console.log(challengeExist.rows)
        if (challengeExist.rowCount === 0) {
            return res
                .status(401)
                .json(`Reading challenge ${challenge_name} does not exist.`)
        } else if (challengeExist.rows[0].challenge_admin !== reader_id) {
            return res
                .status(403)
                .json(
                    `You are not authorized to delete challenge ${challenge_name}`
                )
        }
        //delete challenge
        const deleteChallenge = await pool.query(
            `DELETE FROM reading_challenges WHERE challenge_name = $1 AND challenge_admin = $2`,
            [challenge_name, reader_id]
        )
        res.status(202).json(`Challenge Deleted`)
    } catch (err) {
        console.error(err.message)
    }
})

//Get totals for challenge
router.get(
    '/challenge-total/:challenge_id/:challenge_type',
    authorization,
    async (req, res) => {
        try {
            const { challenge_id, challenge_type } = req.params
            if (challenge_type === 'chapters') {
                const getTotals = await pool.query(
                    `SELECT (SELECT COALESCE(SUM(chapters_read),0)  FROM readers r
                        INNER JOIN readers_reading_challenges rrc
                        ON r.id = rrc.reader_id
                        WHERE rrc.challenge_id = $1) +
                        (SELECT COALESCE(SUM(chapters_read),0) FROM additional_readers ar
                        INNER JOIN adreaders_reading_challenges arc
                        ON ar.ad_reader_id = arc.ad_reader_id
                        WHERE arc.challenge_id = $1) as total`,
                    [challenge_id]
                )
                res.json(getTotals.rows[0])
            } else if (challenge_type === 'books') {
                const getTotals = await pool.query(
                    `SELECT (SELECT COALESCE(SUM(books_read),0)  FROM readers r
                        INNER JOIN readers_reading_challenges rrc
                        ON r.id = rrc.reader_id
                        WHERE rrc.challenge_id = $1) +
                        (SELECT COALESCE(SUM(books_read),0) FROM additional_readers ar
                        INNER JOIN adreaders_reading_challenges arc
                        ON ar.ad_reader_id = arc.ad_reader_id
                        WHERE arc.challenge_id = $1) as total`,
                    [challenge_id]
                )
                res.json(getTotals.rows[0])
            } else {
                const getTotals = await pool.query(
                    `SELECT (SELECT COALESCE(SUM(verses_memorized),0)  FROM readers r
                        INNER JOIN readers_reading_challenges rrc
                        ON r.id = rrc.reader_id
                        WHERE rrc.challenge_id = $1) +
                        (SELECT COALESCE(SUM(verses_memorized),0) FROM additional_readers ar
                        INNER JOIN adreaders_reading_challenges arc
                        ON ar.ad_reader_id = arc.ad_reader_id
                        WHERE arc.challenge_id = $1) as total`,
                    [challenge_id]
                )
                res.json(getTotals.rows[0])
            }
        } catch (err) {
            console.error(err.message)
        }
    }
)

//get reader count per challenge

router.get('/readers-count/:challenge_id', authorization, async (req, res) => {
    const {challenge_id} = req.params;
    try {
    const totalReaders = await.pool(
        `SELECT (SELECT COUNT(rrc.challenge_id) FROM readers_reading_challenges rrc
INNER JOIN reading_challenges rc
ON rc.id = rrc.challenge_id
        WHERE rc.challenge_name = 'Reformation Month 2021') +
        (SELECT COUNT(arc.challenge_id) FROM adreaders_reading_challenges arc
        INNER JOIN reading_challenges rc
        ON rc.id = arc.challenge_id
        WHERE rc.challenge_name = 'Reformation Month 2021') as total`,
        [challenge_id]
    );
        res.json(totalReaders.rows[0])
    } catch(err){
        console.log(err.error)
    }
})

module.exports = router
