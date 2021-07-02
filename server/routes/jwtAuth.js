const router = require('express').Router()
const pool = require('../db')
const bcrypt = require('bcrypt')

const jwtGenerator = require('../utils/jwtGenerator')
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
        // res.json(newReader.rows[0])

        //5. generating our jwt token

        const token = jwtGenerator(newReader.rows[0].id)

        res.json({ token })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//login route

router.post('/login', async (req, res) => {
    try {
        //1. destrucutr the req.body

        const { email, password } = req.body //these are entered by the user

        //2. check if user doesn't exist (if not, throw error)

        const reader = await pool.query(
            'SELECT * FROM readers WHERE email = $1',
            [email]
        )
        if (reader.rows.length === 0) {
            return res.status(401).json('Password or Email is incorrect')
        }
        //3. check if incoming password is same as database password

        const validPassword = await bcrypt.compare(
            //"compare" returns a boolean. bcyrpt takes some time, therefore we must await
            password, //the user's inputted password
            reader.rows[0].user_password //the password stored in the database
        )
        if (!validPassword) {
            return res.status(401).json('Password or Email is incorrect')
        }

        //4. give them the jwt token

        const token = jwtGenerator(reader.rows[0].id)

        res.json({ token })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router
