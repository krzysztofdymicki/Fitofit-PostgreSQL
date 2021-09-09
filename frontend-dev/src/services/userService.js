const axios = require('axios')
const baseURL = 'http://localhost:3001/api/users'

// -- TOKEN USED IN SOME REQUESTS

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

// --- CREATE A NEW USER

const signUp = async (credentials) => {
  const response = await axios.post(baseURL, credentials)
  return response.data
}

// -- GET ACTIVITIES OF THE USER

const getActivities = async (period) => {
  const response = await axios.get(`${baseURL}/activities/${period}`, {
    headers: { Authorization: token },
  })
  return response.data
}

// -- ADD A NEW ACTIVITY

const addActivity = async (newActivity) => {
  const response = await axios.post(`${baseURL}/activities/`, newActivity, {
    headers: { Authorization: token },
  })
  return response.data
}

export default {
  signUp,
  setToken,
  getActivities,
  addActivity,
}
