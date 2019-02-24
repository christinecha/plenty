import React, { Fragment } from 'react'
import axios from 'axios'
import { Form, Field } from 'react-final-form'

import DatePickerField from '../fields/DatePickerField'
import institutionsContainer, { InstitutionsSubscriber } from '../../containers/institutionsContainer'
import transactionsContainer, { TransactionsSubscriber } from '../../containers/transactionsContainer'
import RefProvider from '../util/RefProvider'
import StateProvider from '../util/StateProvider'
import { formatMoney } from '../../util/formatters'
import { validateDateRange } from '../fields/validators'
import TransactionRule from './TransactionRule'

const TransactionRules = ({ filter = () => true }) => (
  <div className="transaction-rules">
    <h1>Transaction Rules</h1>
    
    <TransactionsSubscriber>{() => {
      const { transactionRules } = transactionsContainer

      return (
        <div>
          {transactionRules
            .filter(filter)
            .map((rule, i) => (
              <div key={i}>
                <TransactionRule rule={rule} />
              </div>
            )
          )}

          <StateProvider>{(isActive, setIsActive) => (
            <Fragment>
              {isActive && (
                <Fragment>
                  <label>New Transaction Rule</label>
                  <TransactionRule isEditing />
                </Fragment>
              )}
              {!isActive && (
                <button onClick={() => setIsActive(true)}>
                  New Global Rule +
                </button>
              )}
            </Fragment>
          )}</StateProvider>

        </div>
      )
    }}</TransactionsSubscriber>
  </div>
)

export default TransactionRules