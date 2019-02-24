import React, { Fragment } from 'react'
import axios from 'axios'
import { Form, Field } from 'react-final-form'

import transactionsContainer from '../../containers/transactionsContainer'
import DatePickerField from '../fields/DatePickerField'
import CheckboxField from '../fields/CheckboxField'
import RefProvider from '../util/RefProvider'
import StateProvider from '../util/StateProvider'
import { formatMoney } from '../../util/formatters'
import { validateDateRange } from '../fields/validators'

const submitNewRule = (({ 
  mainCategory = '',
  subCategory = '',
  match = '',
  transactionId = '',
  key = '',
  name = '',
  isHidden = false
}) => {
  let altKey = key || transactionId
  const url = altKey ? `api/transaction-rules/${altKey}` : `api/transaction-rules/new`
  axios.post(url, {
    match,
    key: altKey,
    transactionId,
    isGlobal: !transactionId,
    properties: {
      mainCategory,
      subCategory,
      isHidden,
      name
    }
  })
  .then(() => {
    transactionsContainer.getTransactions()
  })
})

const EditTransactionRule = ({ 
  rule = {},
}) => (
  <Form
    onSubmit={submitNewRule}
    initialValues={{ 
      ...rule,
      ...rule.properties, 
    }}
    render={({ handleSubmit, pristine, invalid }) => (
      <form onSubmit={handleSubmit}>
        <br />
        <div className="fieldset-wrapper">
          <div className="field-wrapper">
            <label>Main Category</label>
            <Field name="mainCategory" component="input" />
          </div>
          <div className="field-wrapper">
            <label>Sub Category</label>
            <Field name="subCategory" component="input" />
          </div>
        </div>
        <div className="fieldset-wrapper">
          <div className="field-wrapper">
            <label>Name</label>
            <Field name="name" component="input" />
          </div>
          <div className="field-wrapper">
            <label>Hide</label>
            <CheckboxField name="isHidden" />
          </div>
        </div>
        
        {!rule.transactionId && (
          <div className="fieldset-wrapper">
            <div className="field-wrapper">
              <label>Match</label>
              <Field name="match" component="input" />
            </div>
          </div>
        )}

        <button onClick={handleSubmit}>submit changes</button>
      </form>
    )}
  />
)

const TransactionRule = ({ 
  rule = {},
  isEditing = false
}) => (
  <div className="transaction-rule">
    {isEditing
      ? <EditTransactionRule rule={rule} />
      : <div className="transaction-rule-preview">
          Match: {rule.match}
        </div>
    }
  </div>
)

export default TransactionRule