const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')

//middleware
app.use(cors())
app.use(express.json()) //for req.body

//ROUTES
//register and login routes
app.use('/auth', require('./routes/jwtAuth'))

//dashboard route

app.use('/dashboard', require('../server/routes/dashboard'))

//find-challenges routes

app.use('/find-challenges', require('../server/routes/findChallenge'))

//challenge-dashboard routes

app.use('/challenge-dashboard', require('../server/routes/challengeDashboard'))

//reader-dashboard routes

app.use('/reader-dashboard', require('../server/routes/readerDashboard'))

//increment or decrement challenge totals per reader

app.use('/submit-report', require('../server/routes/submitReading'))

//CRUD FOR readers
//create new reader with app.post

app.get('/readers', async (req, res) => {
    try {
        const { first_name, last_name, user_password, email } = req.body

        const results = await fetch(`SELECT $1, $2, $3, $4 FROM readers;`, [
            first_name,
            last_name,
            user_password,
            email,
        ])
        const parsRes = res.json(results)
        console.log(parsRes)
    } catch (err) {
        console.error(err.message)
    }
})

app.post('/readers', async (req, res) => {
    try {
        const {
            first_name, //trying to get all of the inputs for the database
            last_name,
            email,
            user_password,
            chapters_read,
            books_read,
            verses_memorized,
        } = req.body

        const newReader = await pool.query(
            `INSERT INTO readers (
                first_name, 
                last_name, 
                email, 
                user_password, 
                chapters_read, 
                books_read, 
                verses_memorized) 
            
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                first_name,
                last_name,
                email,
                user_password,
                chapters_read,
                books_read,
                verses_memorized,
            ]
        )
        res.json(newReader)
    } catch (err) {
        console.error(err.message)
    }
})

//get a reader with app.get
app.get('/readers/:id', async (req, res) => {
    try {
        const { id } = req.params
        const reader = await pool.query('SELECT * FROM readers WHERE id = $1', [
            id,
        ])
        res.json(reader.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})
//update a reader with app.put
app.put('/readers/:id', async (req, res) => {
    try {
        const { id } = req.params
        const results = await pool.query(
            `UPDATE readers SET 
        first_name = $1, 
        last_name = $2,
        email = $3, 
        user_password = $4, 
        chapters_read = $5, 
        books_read = $6, 
        verses_memorized = $7, 
        WHERE id = $9
        RETURNING *`,
            [
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.user_password,
                req.body.chapters_read,
                req.body.books_read,
                req.body.verses_memorized,
                id,
            ]
        )
        res.json('Reader was updated')
    } catch (err) {
        console.error(err.message)
    }
})
//delete a  with app.delete
app.delete('/readers/:id', async (req, res) => {
    try {
        const { id } = req.params
        const results = pool.query('DELETE FROM readers WHERE id = $1', [id])
        res.json('Reader was deleted')
    } catch (err) {
        console.error(err.message)
    }
})

//CRUD FOR READING CHALLENGE

// get all reading challenges
app.get('/reading_challenges', async (req, res) => {
    try {
        const allChallenges = pool.query('SELECT * FROM reading_challenges')
        res.json(allChallenges.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

// get a reading challenge

// create reading challenge

// update reading challenge

// delete reading challenge

app.listen(5000, () => {
    console.log(`Server listening on PORT 5000`)
})
