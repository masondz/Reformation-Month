module.exports = (req, res, next) => {
    const {
        email,
        first_name,
        last_name,
        user_password,
        family_name,
        fg_password,
    } = req.body

    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    }

    if (req.path === '/register') {
        if (![email, first_name, last_name, user_password].every(Boolean)) {
            return res.status(401).json('Missing Credentials')
        } else if (!validEmail(email)) {
            return res.status(401).json('Invalid Email')
        }
    } else if (req.path === '/login') {
        if (![email, user_password].every(Boolean)) {
            return res.status(401).json('Missing Credentials')
        } else if (!validEmail(email)) {
            return res.json('Invalid Email')
        }
    } else if (req.path === '/family-group/add-reader') {
        if (![family_name, fg_password].every(Boolean)) {
            return res.status(401).json('Incorrect Family Name or Password')
        }
    }

    next()
}
