const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')

router.post('/', async (req, res) => {
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

module.exports = router
