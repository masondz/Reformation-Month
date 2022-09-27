const router = require('express').Router() //easeir navigate paths
const pool = require('../db') // allows us to do CRUD requrest with postgresql database
const bcrypt = require('bcryptjs') // encrypts password
const validInfo = require('../middleware/validinfo') // checks for valid entries (first_name, last_name. user_password, email)
const Authorization = require('../middleware/Authorization') // checks if user is authorized

const jwtGenerator = require('../utils/jwtGenerator')
