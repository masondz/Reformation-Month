const router = require('express').Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
//registering

router.post('/register', async (req, res) => {
    try {
        //1. destructure req.body

        const { first_name, last_name, user_password, email } = req.body

        //2. check if user exist (if reader exists throw erroy)

        const reader = await pool.query(
            'SELECT * FROM readers WHERE email = $1',
            [email]
        )
        if (reader.rows.length !== 0) {
            return res.status(401).send('User already exists.')
        }
        //3. bcrypt user password
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(user_password, salt) //it takes time to encrypt password, otherwise it returns and empty object( '{}' )?
        //also, the password lenght ( VARCHAR(#) ) in the database schema must be long enough to accomodate encrypted password

        //4. enter new reader inside our database

        const newReader = await pool.query(
            `INSERT INTO readers (
            first_name, 
            last_name, 
            email, 
            user_password) 
        
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
            [first_name, last_name, email, bcryptPassword] //rest of columns have default values
        )
        res.json(newReader.rows[0])

        //5. generating our jwt token
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router
