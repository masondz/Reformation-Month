const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/Authorization')
const bcrypt = require('bcryptjs') // encrypts password
const validinfo = require('../middleware/validinfo')

//get family group
router.get('/', authorization, async (req, res) => {
    try {
        const getFamilyGroup = await pool.query(
            `SELECT family_name, id, ARRAY (SELECT r.first_name FROM readers r
            INNER JOIN family_group fg
            ON r.id = ANY(fg.reader_ids)
                WHERE $1 = ANY(fg.reader_ids)) as primary_readers
            FROM family_group WHERE $1 = ANY(reader_ids)`,
            [req.user]
        )
        if (getFamilyGroup.rowCount === 0) {
            res.status(401).json('You are not in family group')
        }
        res.json(getFamilyGroup.rows[0])
        console.log(getFamilyGroup.rows)
    } catch (err) {
        console.error(err.message)
    }
})

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
    console.log(newFamilyGroup)
    res.json(newFamilyGroup)
})

//update family group
router.put('/', authorization, async (req, res) => {
    try {
        const { family_name, fg_id } = req.body
        //check if family name already exists.
        const familyGroup = await pool.query(
            'SELECT family_name FROM family_group WHERE family_name = $1',
            [family_name]
        )
        if (familyGroup.rows.length !== 0) {
            // check if user already exists
            return res.status(401).json('Family Name already taken.')
        }

        const updateFamilyGroup = pool.query(
            'UPDATE family_group SET family_name = $1 WHERE id =$2 RETURNING family_name',
            [family_name, fg_id]
        )
        console.log(res.json(updateFamilyGroup))
    } catch (err) {
        console.error(err.message)
    }
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
        res.json(adReaderFG)
        console.log(adReaderFG)
    } catch (err) {
        console.error(err.message)
    }
})

//remove additional_reader from family group

//add another reader.id to reader_ids
router.put('/add-reader', authorization, validinfo, async (req, res) => {
    try {
        //check if password is correct
        const { family_name, fg_password, reader_id } = req.body //these are entered by the user

        //2. check if Family Name exists (if not, throw error)

        const familyGroup = await pool.query(
            'SELECT * FROM family_group WHERE family_name = $1',
            [family_name]
        )
        if (familyGroup.rows.length === 0) {
            return res.status(401).json('Password or Family Name is incorrect')
        }
        //3. check if incoming password is same as database password

        const validPassword = await bcrypt.compare(
            //"compare" returns a boolean. bcyrpt takes some time, therefore we must await
            fg_password, //the user's inputted password
            familyGroup.rows[0].fg_password //the password stored in the database
        )
        if (!validPassword) {
            return res.status(401).json('Password or Family Name is incorrect')
        }

        //add reader to reader_ids array
        const addReader = await pool.query(
            `UPDATE family_group SET reader_ids = array_append(reader_ids, $1::uuid) WHERE family_name = $2 RETURNING reader_ids`,
            [reader_id, family_name]
        )
        res.json(addReader)
    } catch (err) {
        console.log(err.message)
    }
})

//remove reader from family group
router.put('/remove-reader', authorization, async (req, res) => {
    try {
        const { reader_id, fg_id } = req.body
        const removeReader = await pool.query(
            `UPDATE family_group SET reader_ids = array_remove(reader_ids, $1) WHERE id=$2`,
            [reader_id, fg_id]
        )
        res.json(removeReader)
        console.log(removeReader)
    } catch (err) {
        console.log(err.message)
    }
})

module.exports = router
