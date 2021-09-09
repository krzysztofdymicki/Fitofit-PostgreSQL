import '../styles/Statistics.css'
import React from 'react'
import { Table, Input } from 'reactstrap'

const Statistics = ({ activities, period, handlePeriodChange }) => {
  if (!activities || !activities.length) return null

  const transformDate = (date) => {
    date = new Date(date)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  const total = (period) => {
    if (period === 'week') {
      return `${Math.round(activities.reduce((a, b) => a + b.distance, 0))} km`
    } else if (period === 'month') {
      return `${Math.round(activities.reduce((a, b) => a + b.total, 0))} km`
    }
  }

  const generateStats = (period) => {
    if (period === 'month' && activities[0]) {
      return (
        <Table bordered id="statistics-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            {activities
              .sort((a, b) => a.day - b.day)
              .map((a, i) => {
                return (
                  <tr key={i}>
                    <td>{a.day}</td>
                    <td>{a.total} km</td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      )
    } else if (period === 'week') {
      return (
        <Table bordered id="statistics-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id}>
                <td>{transformDate(a.date)}</td>
                <td>{a.start}</td>
                <td>{a.end}</td>
                <td>{a.distance} km</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )
    }
  }

  return (
    <div id="statistics-container">
      <form onChange={handlePeriodChange}>
        <label for="radio-week">Week</label>
        <input
          type="radio"
          name="period"
          value="week"
          id="radio-week"
          checked={period === 'week'}
        ></input>
        <br></br>
        <label for="radio-month">Month</label>
        <input
          type="radio"
          name="period"
          value="month"
          id="radio-month"
          checked={period === 'month'}
        ></input>
      </form>
      <h3>{period === 'week' ? 'This week' : 'This month'}</h3>
      <h4>Total: {total(period)}</h4>
      {generateStats(period)}
    </div>
  )
}

export default Statistics
