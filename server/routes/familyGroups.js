const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')
const bcrypt = require('bcrypt') // encrypts password

//create family group
router.post('/', authorization, async (req, res) => {
    const { family_name, reader_id, fg_password } = req.body

    //check if family name already exists.
    const familyGroup = await pool.query(
        'SELECT family_name FROM family_group WHERE family_name = $1',
        [family_name]
    )
    if (familyGroup.rows.length !== 0) {
        // check if user already exists
        return res.status(401).json('Family Name already taken.')
    }

    //3. bcrypt password
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const bcryptPassword = await bcrypt.hash(fg_password, salt) //it takes time to encrypt password, otherwise it returns and empty object( '{}' )?
    //also, the password lenght ( VARCHAR(#) ) in the database schema must be long enough to accomodate encrypted password

    const newFamilyGroup = await pool.query(
        `INSERT INTO family_group (
    family_name, 
    reader_ids, 
    fg_password) 

VALUES ($1, ARRAY [$2::uuid], $3)
RETURNING *`,
        [family_name, reader_id, bcryptPassword] //rest of columns have default values
    )
})

//insert additional_reader with family_group. ad_reader_id should be a single id value
router.put('/add-additional-reader', authorization, async (req, res) => {
    //let's try adding a parameter
    try {
        const { ad_reader_id, fg_id } = req.body

        const adReaderFG = await pool.query(
            `UPDATE family_group SET additional_reader_ids = array_append(additional_reader_ids, $1::uuid) WHERE id = $2 RETURNING additional_reader_ids`,
            [ad_reader_id, fg_id]
        )
        const parsRes = res.json(adReaderFG)
        console.log(parsRes)
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router
