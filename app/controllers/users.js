const config = require('../utils/config')
const dateFunctions = require('../utils/dateFunctions')
const bcrypt = require('bcrypt')
const axios = require('axios')
const geolib = require('geolib')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const db = require('../db/index')

//  ------------- CREATE A NEW USER ----------------------- //

usersRouter.post('/', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      error: 'Both password and username must be provided',
    })
  }
  const { username, password } = req.body

  if (username.length < 8 || password.length < 8) {
    res.status(400).json({
      error: 'Both password and username should be at least 8 characters long',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const result = await db.query(
    `
      INSERT INTO users(username, password_hash)
      VALUES ($1, $2)
      RETURNING *
    `,
    [username, passwordHash]
  )

  const userToSend = result.rows[0]

  res.status(200).json(userToSend)
})

// -------------------- ADD NEW ACTIVITY -------------------- //

const locationIQURL = (adr) => {
  const url = `https://eu1.locationiq.com/v1/search.php?key=${
    config.LOCATIONIQ_KEY
  }&q=${encodeURI(adr)}&format=json`
  return url
}

const getCoordinates = async (url) => {
  const response = await axios.get(url)
  return response.data
}

usersRouter.post('/activities', async (req, res) => {
  // VERIFY IS TOKEN IS OK

  if (!req.token) return res.status(401).json({ error: 'token missing' })
  const decodedToken = jwt.verify(req.token, config.JWT_SECRET)
  if (!decodedToken.id) return res.status(401).json({ error: 'token invalid' })
  const { start, end, date } = req.body

  //FIND THE USER IN THE DB

  const userQuery = await db.query(
    'SELECT user_id FROM users WHERE user_id = $1',
    [decodedToken.id]
  )
  if (!userQuery.rows)
    return res.status(404).json({
      error: 'No such an user in the database',
    })
  const userInDb = userQuery.rows[0]

  // FIND COORDINATES AND CALCULATE THE DISTANCE

  const startCoordinates = await getCoordinates(locationIQURL(start))
  const endCoordinates = await getCoordinates(locationIQURL(end))
  const distance =
    geolib.getDistance(
      {
        latitude: startCoordinates[0].lat,
        longitude: startCoordinates[0].lon,
      },
      { latitude: endCoordinates[0].lat, longitude: endCoordinates[0].lon }
    ) / 1000

  // INSERT NEW ACTIVITY INTO THE DB

  const activityParams = [
    start,
    end,
    new Date(date),
    distance,
    userInDb.user_id,
  ]

  const activityQuery = await db.query(
    `
      INSERT INTO activities(activity_start, activity_end, activity_date, activity_distance, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING activity_id "id", activity_start "start", activity_end "end", activity_date "date", activity_distance "distance"
      `,
    activityParams
  )

  const activityToSend = activityQuery.rows[0]

  res.status(200).json(activityToSend)
})

// ---------------- GET ACTIVITIES OF THE USER --------------------- //

usersRouter.get('/activities/:period', async (req, res) => {
  // VERIFY IS TOKEN IS OK

  if (!req.token) return res.status(401).json({ error: 'token missing' })
  const decodedToken = jwt.verify(req.token, config.JWT_SECRET)
  if (!decodedToken.id) return res.status(401).json({ error: 'token invalid' })

  //FIND THE USER IN THE DB

  const userQuery = await db.query('SELECT * FROM users WHERE user_id = $1', [
    decodedToken.id,
  ])
  const userInDb = userQuery.rows[0]
  if (!userQuery.rows)
    return res.status(404).json({
      error: 'No such an user in the database',
    })

  let activities = []

  // -- SELECT ONLY ONE WEEK OF ACTIVITIES -- //

  if (req.params.period === 'week') {
    const activitiesWeekQuery = await db.query(
      `
      SELECT activity_id "id", activity_date "date", activity_distance "distance", activity_end "end", activity_id "id", activity_start "start"
      FROM activities
      WHERE activity_date BETWEEN $1 AND $2
      AND
      user_id = $3
    `,
      [dateFunctions.startOfWeek(), dateFunctions.endOfWeek(), userInDb.user_id]
    )
    return res.status(200).json(activitiesWeekQuery.rows)
  } // -- SELECT ONLY ONE MONTH OF ACTIVITIES AGGREGATED BY DAY -- //
  else if (req.params.period === 'month') {
    const activitiesMonthQuery = await db.query(
      `
        SELECT to_char(activity_date, 'fmDD')  "day", sum(activity_distance)::DECIMAL total
        FROM activities
        WHERE user_id = $1
        AND
        to_char(activity_date, 'MM')::INTEGER = $2 AND to_char(activity_date, 'YYYY')::INTEGER = $3
        GROUP BY to_char(activity_date, 'fmDD')
      `,
      [
        userInDb.user_id,
        dateFunctions.currentMonth(),
        dateFunctions.currentYear(),
      ]
    )

    return res.status(200).json(activitiesMonthQuery.rows)
  }

  res.status(200).json(activities)
})

module.exports = usersRouter
