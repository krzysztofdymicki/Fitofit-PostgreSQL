import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

const SignForm = ({ active, setNotification, handleSignIn, handleSignUp }) => {
  // --- SUBMIT FUNCTION DEPENDING ON THE TYPE OF ACTION (SIGN UP / SIGN IN)

  const handleSubmit = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    if (username.length < 8 || password.length < 8) {
      setNotification({
        message:
          'Both password and username should be at least 8 characters long',
        color: 'red',
      })
      return setTimeout(() => {
        setNotification('')
      }, 5000)
    }
    const credentials = {
      username,
      password,
    }

    if (active === 'SIGN UP') {
      handleSignUp(credentials)
    } else if (active === 'SIGN IN') {
      handleSignIn(credentials)
    }
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="username">Username</Label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="min. 8 characters"
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="min. 8 characters"
        />
      </FormGroup>
      <Button
        type="submit"
        color={active === 'SIGN UP' ? 'primary' : 'secondary'}
        className="submit-button"
      >
        {active === 'SIGN UP' ? 'SIGN UP' : 'SIGN IN'}
      </Button>
    </Form>
  )
}

export default SignForm
