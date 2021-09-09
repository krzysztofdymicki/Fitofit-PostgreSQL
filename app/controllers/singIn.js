const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const signInRouter = require('express').Router()
const db = require('../db/index')

// ------- SIGN IN ----------- //

signInRouter.post('/', async (req, res) => {

  // CHECK IF CREDENTIALS WERE PROVIDED

  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      error: 'Both password and username must be provided',
    })
  }
  const { username, password } = req.body

// FIND THE USER IN THE DB

  const userQuery = await db.query(
    `
    SELECT * FROM users WHERE username = $1
`,
    [username]
  )

  const userInDb = userQuery.rows[0]
  
// VERIFY PASSWORDHASH

  if (!userInDb || !bcrypt.compare(password, userInDb.password_hash)) {
    return res.status(401).json({
      error: 'username or password wrong',
    })
  }

// CREATE JWT TOKEN

  const userForToken = {
    username: userInDb.username,
    id: userInDb.user_id,
  }

  const token = jwt.sign(userForToken, config.JWT_SECRET)

  const detailsToSend = {
    token,
    username: userForToken.username,
  }

  res.status(200).json(detailsToSend)
})

module.exports = signInRouter
