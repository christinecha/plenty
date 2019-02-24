import React from 'react'
import { Field } from 'react-final-form'

const CheckboxField = ({
  name
}) => (
  <Field name={name} type="checkbox">
    {({ input }) => {
      return (
        <div>
          <input type="checkbox" onChange={input.onChange}/>
        </div>
      )
    }}
  </Field>
)

export default CheckboxField