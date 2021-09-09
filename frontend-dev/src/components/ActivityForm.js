import '../styles/ActivityForm.css'
import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
let DatePicker = require('reactstrap-date-picker')

const ActivityForm = ({ addActivity }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    addActivity({
      start: event.target.startAdress.value,
      end: event.target.endAdress.value,
      date: event.target.datepicker.value,
    })
    event.target.startAdress.value = ''
    event.target.endAdress.value = ''
  }
  return (
    <Form id="activity-form" onSubmit={handleSubmit}>
      <h3>Add new activity</h3>
      <FormGroup>
        <Label for="startAdress" id="start-adress-label">
          <b>Start adress</b> in format like: "Plac Europejski 2, Warszawa,
          Polska"
        </Label>
        <Input
          type="text"
          name="startAdress"
          id="startAdress"
          placeholder="Adress in format: Street nr, city, country"
        />
      </FormGroup>
      <FormGroup>
        <Label for="endAdress" id="end-adress-label">
          <b>End adress</b> in format like: "Plac Europejski 2, Warszawa,
          Polska"
        </Label>
        <Input
          type="text"
          name="endAdress"
          id="endAdress"
          placeholder="Adress in format: Street nr, city, country"
        />
      </FormGroup>
      <FormGroup>
        <Label for="datepicker" id="datepicker">
          <b>Choose the date</b>
        </Label>
        <DatePicker id="datepicker" name="datepicker" dateFormat="YYYY-MM-DD" />
      </FormGroup>
      <br></br>
      <b>Calculate distance and save!</b>
      <br></br>
      <Button color="primary" type="submit">
        GO
      </Button>
    </Form>
  )
}

export default ActivityForm
