const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')

//create challenge
router.post('/', authorization, async (req, res) => {
    try {
        const {
            challenge_name,
            organization,
            challenge_type,
            challenge_admin,
            goal,
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
            [
                challenge_name,
                organization,
                challenge_type,
                challenge_admin,
                goal,
            ]
        )
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
        console.log(challengeExist)
        if (challengeExist.rowCount === 0) {
            return res
                .status(401)
                .json(`Reading challenge ${challenge_name} does not exist.`)
        } else if (challengeExist.rows[0].challenge_admin !== reader_id) {
            return res
                .status(403)
                .json(
                    `You are not authorized to update challenge ${challenge_name}`
                )
        }

        //check if authorized to change challenge
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

module.exports = router
