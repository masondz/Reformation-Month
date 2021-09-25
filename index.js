const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const path = require('path')
const { allowedNodeEnvironmentFlags } = require('process')
const PORT = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json()) //for req.body

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')))
}

//ROUTES
//register and login routes
app.use('/auth', require('./routes/jwtAuth'))

//dashboard route

app.use('/dashboard', require('./routes/dashboard'))

//find-challenges routes

app.use('/find-challenges', require('./routes/findChallenge'))

//challenge-dashboard routes

app.use('/challenge-dashboard', require('./routes/challengeDashboard'))

//reader-dashboard routes

app.use('/reader-dashboard', require('./routes/readerDashboard'))

//increment or decrement challenge totals per reader

app.use('/submit-report', require('./routes/submitReading'))

//add, update, or remove additional readers

app.use('/additional-readers', require('./routes/additionalReaders'))

//family-group routes

app.use('/family-group', require('./routes/familyGroups'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
})
