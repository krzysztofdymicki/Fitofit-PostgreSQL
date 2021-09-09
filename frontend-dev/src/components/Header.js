import '../styles/Header.css'
import React from 'react'
import { Button } from 'reactstrap'

const Header = ({ username, handleSignOut }) => {
  return (
    <div id="header-container">
      <p>{username}</p>
      <Button color="primary" onClick={handleSignOut}>
        LOG OUT
      </Button>
    </div>
  )
}

export default Header
