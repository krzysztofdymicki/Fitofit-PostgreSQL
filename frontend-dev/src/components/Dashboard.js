import '../styles/Dashboard.css'
import React, { useEffect, useState } from 'react'
import ActivityForm from './ActivityForm'
import Statistics from './Statistics'

const Dashboard = ({ getActivities, addActivity, activities }) => {

  const [period, setPeriod] = useState('week')

  useEffect(() => {
   getActivities(period)
  }, [period])

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value)
  }

  return (
    <div id="dashboard-container">
      <ActivityForm addActivity={addActivity} />
      <Statistics activities={activities} period={period} handlePeriodChange={handlePeriodChange} />
    </div>
  )
}

export default Dashboard
