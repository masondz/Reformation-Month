const router = require('express').Router() //easeir navigate paths
const pool = require('../db') // allows us to do CRUD requrest with postgresql database
const validInfo = require('../middleware/validinfo') // checks for valid entries (first_name, last_name. user_password, email)
require('dotenv').config()
const nodemailer = require('nodemailer')
const { useRouteMatch } = require('react-router-dom')
const crypto = require('crypto')

let emailLink = ''

if (
    process.env.NODE_ENV === 'production'
        ? (emailLink = 'reformation-month.herokuapp.com')
        : (emailLink = 'localhost:3000')
)
    router.post('/', validInfo, async (req, res) => {
        const { email, user_password } = req.body
        const reader = await pool.query(
            'SELECT * FROM readers WHERE email = $1',
            [email]
        )
        console.log(reader)
        if (reader.rowCount === 0) {
            return res.status(403).json('email not in db')
        } else {
            const token = crypto.randomBytes(20).toString('hex')
            // const token = 'test'
            const resetDate = Date.now() + 3600000

            const updatePassToken = await pool.query(
                'UPDATE readers SET resettoken = $1, resetexpires = $2 WHERE email = $3',
                [token, resetDate, email]
            )

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: `${process.env.EMAIL_ADDRESS}`,
                    pass: `${process.env.EMAIL_PASSWORD}`,
                },
            })

            const mailOption = {
                from: 'RMonthHelp@gmail.com',
                to: `${email}`,
                subject: 'Reformation Month Password Reset Link',
                text:
                    `You are receiving this because you or someone else have requested to reset your password.\n\n` +
                    `Please click on the following link, or paste this intor your browser to complete the process within one hour of receiving it:\n\n` +
                    `http://${emailLink}/reset/${token}\n\n` +
                    `If you did not request to change your password, please ignore.`,
            }

            transporter.sendMail(mailOption, function (err, response) {
                if (err) {
                    console.error('there was an error: ', err)
                } else {
                    console.log('here is the res: ', response)
                    res.status(200).json('recovery email sent')
                }
            })
        }
    })

module.exports = router
