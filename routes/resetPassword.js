const router = require('express').Router() //easeir navigate paths
const pool = require('../db') // allows us to do CRUD requrest with postgresql database
const validInfo = require('../middleware/validinfo') // checks for valid entries (first_name, last_name. user_password, email)
require('dotenv').config()
const { useRouteMatch } = require('react-router-dom')
const bcrypt = require('bcryptjs')

router.get('/reset/:token', async (req, res) => {
    try {
        const token = req.params.token
        const reader = await pool.query(
            'SELECT resettoken, resetexpires, email FROM readers WHERE resettoken = $2',
            [token]
        )
        if (reader.rowCount === 0) {
            return res.status(401).json('Token is not valid')
        } else if (reader.rows[0].resetexpires < Date.now()) {
            return res.status(403).json('Token is expired')
        } else {
            return res.satus(200).send({
                email: reader.email,
                message: 'password reset link a-ok',
            })
        }
        //need to check token
        /*if (reader.resettoken < Date.now()) {
            return res.status(401).json('password reset link is invalid or has expired)
        } else {
            
        }
        */
        //res.json(reader.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

router.put('/reset/:token', async (req, res) => {
    try {
        const { email, user_password, token } = req.body

        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(user_password, salt)

        const reader = await pool.query(
            `UPDATE readers
                SET user_password = $1,
                resettoken = null,
                resetexpires = null
                WHERE email = $2 AND resettoken = $3`,
            [user_password, email, token]
        )
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router
