const router = require('express').Router() //easeir navigate paths
const pool = require('../db') // allows us to do CRUD requrest with postgresql database
// encrypts password
const validInfo = require('../middleware/validinfo') // checks for valid entries (first_name, last_name. user_password, email)
const Authorization = require('../middleware/Authorization') // checks if user is authorized

const jwtGenerator = require('../utils/jwtGenerator')
//registering

router.post('/register', validInfo, async (req, res) => {
    //valid info: middlware that checks if email has '@' sign, and that password an name are not blank.
    try {
        //1. destructure req.body

        const { first_name, last_name, user_password, email } = req.body

        //2. check if user exist (if reader exists throw erroy)

        const reader = await pool.query(
            'SELECT * FROM readers WHERE email = $1',
            [email]
        )
        if (reader.rows.length !== 0) {
            // check if user already exists
            return res.status(401).json('User already exists.')
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

router.post('/login', validInfo, async (req, res) => {
    try {
        //1. destrucutr the req.body

        const { email, user_password } = req.body //these are entered by the user

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
            user_password, //the user's inputted password
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

router.get('/is-verify', Authorization, async (req, res) => {
    //checks authorization. Bulk of code is handles by middleware
    try {
        res.json(true)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router
