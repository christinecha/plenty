import React from 'react'
import { Field } from 'react-final-form'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import 'react-day-picker/lib/style.css'


const DatePickerField = ({
  name
}) => (
  <Field name={name}>
    {({ input }) => {
      const onChange = (n) => {
        input.onChange(moment(n).format('YYYY-MM-DD'))
      }

      return (
        <div>
          <DayPickerInput 
            value={input.value} 
            onDayChange={onChange}
          />
        </div>
      )
    }}
  </Field>
)

export default DatePickerField