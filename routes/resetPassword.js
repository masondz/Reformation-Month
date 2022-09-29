const router = require('express').Router() //easeir navigate paths
const pool = require('../db') // allows us to do CRUD requrest with postgresql database
const validInfo = require('../middleware/validinfo') // checks for valid entries (first_name, last_name. user_password, email)
require('dotenv').config()
const { useRouteMatch } = require('react-router-dom')

router.get('/reset/:token', async (req, res) => {
    try {
        const token = req.params.token
        const reader = await pool.query(
            'SELECT resettoken, resetexpires, email FROM readers WHERE resettoken = $2',
            [token]
        )
        if (reader.rowCount === 0) {
           return res.status(401).json('Token is not valid')
        } else if (reader.rows[0].resetexpires < Date.now() {
            return res.status(403).json('Token is expired')
        } else {
            res.satus(200).send({
                email: reader.email,
                message: 'password reset link a-ok'
            });
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

module.exports = router
