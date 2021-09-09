import '../styles/Main.css'
import date from '../utils/dateFunctions'
import React, { useState, useEffect } from 'react'
import { ButtonToggle } from 'reactstrap'
import SignForm from './SignForm'
import Header from './Header'
import Dashboard from './Dashboard'
import userService from '../services/userService'
import signInService from '../services/signIn'

const Main = () => {
  const [user, setUser] = useState({})
  const [active, setActive] = useState('SIGN IN')
  const [notification, setNotification] = useState({ message: '', color: '' })

  // -- CHECK IF THE USER HAS ALREADY BEEN LOGGED IN --

  useEffect(() => {
    const loggedStorageUser = window.localStorage.getItem('loggedUser')
    if (loggedStorageUser) {
      const user = JSON.parse(loggedStorageUser)
      setUser(user)
      userService.setToken(user.token)
    }
  }, [])

  // -- HANDLERS --

  const selectActiveClick = (event) => {
    setActive(event.target.value)
  }

  const handleSignIn = async (credentials) => {
    try {
      const loggedUser = await signInService.signIn(credentials)
      userService.setToken(loggedUser.token)
      setUser({
        ...loggedUser,
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
    } catch (e) {
      setNotification({
        color: 'red',
        message: 'You passed wrong credentials',
      })
      setTimeout(() => {
        setNotification('')
      }, 5000)
    }
  }

  const handleSignUp = async (credentials) => {
    window.localStorage.removeItem('loggedUser')
    try {
      await userService.signUp(credentials)
      setNotification({
        message: 'New account created, you can now log in',
        color: 'green',
      })
      setTimeout(() => {
        setNotification('')
      }, 5000)
    } catch (e) {
      setNotification({
        message: 'This username is already in use',
        color: 'red',
      })
      setTimeout(() => {
        setNotification('')
      }, 5000)
    }
  }

  const handleSignOut = () => {
    userService.setToken(null)
    window.localStorage.removeItem('loggedUser')
    setUser({})
  }

  const getActivities = async (period) => {
    const activities = await userService.getActivities(period)
    setUser({
      ...user,
      activities: activities.map((a) => {
        return period === 'week'
          ? {
              ...a,
              date: new Date(a.date),
              distance: +a.distance,
            }
          : {
              ...a,
              total: +a.total,
            }
      }),
    })
  }

  const addActivity = async (newActivity) => {
    try {
      const newActivityToAttach = await userService.addActivity(newActivity)
      if (newActivityToAttach) {
        const newDate = new Date(newActivityToAttach.date)
        const newDateTime = newDate.getTime()
        const startOfWeek = date.startOfWeek().getTime()
        const endOfWeek = date.endOfWeek().getTime()

        if (newDateTime > startOfWeek && newDateTime < endOfWeek) {
          setUser({
            ...user,
            activities: user.activities.concat({
              ...newActivityToAttach,
              date: new Date(newActivityToAttach.date),
              distance: +newActivityToAttach.distance,
            }),
          })
        }
        setNotification({
          message: `Activity saved. Distance: ${newActivityToAttach.distance} km`,
          color: 'green',
        })
        setTimeout(() => setNotification(''), 5000)
      } else {
        setNotification({
          message: 'Error with last activity',
          color: 'red',
        })
        setTimeout(() => {
          setNotification('')
        }, 5000)
      }
    } catch (e) {
      setNotification({
        message: 'Fill every field and try again',
        color: 'red',
      })
      setTimeout(() => {
        setNotification({
          message: '',
          color: '',
        })
      }, 5000)
    }
  }

  // -- WHEN USER IS NOT LOGGED IN, DISPLAY SIGN FORM

  if (!user.username) {
    return (
      <div id="main-sign-container">
        <h1>Fitofit</h1>
        <div className="buttons-container">
          <ButtonToggle
            color="secondary"
            size="lg"
            value="SIGN IN"
            onClick={selectActiveClick}
          >
            SIGN IN
          </ButtonToggle>
          {'  '}
          <ButtonToggle
            color="primary"
            size="lg"
            value="SIGN UP"
            onClick={selectActiveClick}
          >
            SIGN UP
          </ButtonToggle>
        </div>
        <div id="main-forms-container">
          {notification ? (
            <h5 style={{ color: notification.color }}>
              {notification.message}
            </h5>
          ) : null}
          <SignForm
            active={active}
            setNotification={setNotification}
            handleSignIn={handleSignIn}
            handleSignUp={handleSignUp}
          />
        </div>
      </div>
    )
  } else {
    // -- WHEN USER IS LOGGED IN, DISPLAY USER'S PANEL

    return (
      <div id="main-logged-container">
        <Header username={user.username} handleSignOut={handleSignOut} />
        <h4 style={{ color: notification.color }} id="main-logged-notification">
          {notification.message}
        </h4>
        <Dashboard
          getActivities={getActivities}
          addActivity={addActivity}
          activities={user.activities}
        />
      </div>
    )
  }
}

export default Main
