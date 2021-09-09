require('dotenv').config()

const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET
const LOCATIONIQ_KEY = process.env.LOCATIONIQ_KEY
const DATABASE_URL = process.env.DATABASE_URL

module.exports = {
  PORT,
  JWT_SECRET,
  LOCATIONIQ_KEY,
  DATABASE_URL,
}
