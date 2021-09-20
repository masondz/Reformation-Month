module.exports = (req, res, next) => {
    const { challenge_name, organization, challenge_type, goal } = req.body
    console.log('middleware: ' + challenge_name)
    if (req.path === '/challenge-dashboard') {
        if (
            ![challenge_name, organization, challenge_type, goal].every(Boolean)
        ) {
            console.log('if statment: challenge_name = ' + challenge_name)
            return res.status(401).json('Please fill out all fields')
        }
    }
    next()
}
