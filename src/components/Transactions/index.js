import React, { Fragment } from 'react'
import axios from 'axios'
import { Form, Field } from 'react-final-form'

import Transaction from './Transaction'
import DatePickerField from '../fields/DatePickerField'
import institutionsContainer, { InstitutionsSubscriber } from '../../containers/institutionsContainer'
import transactionsContainer, { TransactionsSubscriber } from '../../containers/transactionsContainer'
import RefProvider from '../util/RefProvider'
import StateProvider from '../util/StateProvider'
import { formatMoney } from '../../util/formatters'
import { validateDateRange } from '../fields/validators'

import 'react-day-picker/lib/style.css';

const TransactionsByCategory = () => {
  const categories = transactionsContainer.transactionsByCategory
  console.log(categories)

  const grandTotalIncome = categories.reduce((sum, t) => t.totalIncome + sum, 0)
  const grandTotalExpenses = categories.reduce((sum, t) => t.totalExpenses + sum, 0)
  const net = grandTotalIncome + grandTotalExpenses

  return (
    <div className="transactions-wrapper">
      <div className="transactions">
        {categories.map((mainCat, i) => (
          <StateProvider key={i}>{(isOpen, setOpen) => (
            <div className="main-category">
              <span className="main-category-header" onClick={() => setOpen(!isOpen)}>
                <h2>{mainCat.name}</h2>
                <h2 className="amt">{formatMoney(mainCat.totalAmount)}</h2>
              </span>

              {isOpen && mainCat.subcategories.map((subCat, j) => {
                return (
                  <div className="sub-category" key={j}>
                    <span className="sub-category-header">
                      <h3>{subCat.name}</h3>
                      <h3 className="amt">{formatMoney(subCat.totalAmount)}</h3>
                    </span>

                    {subCat.transactions.map(t => (
                      <Transaction key={t.transaction_id} transaction={t} />
                    ))}
                  </div>
                )
              })}
            </div>
          )}</StateProvider>
          )
        )}
      </div>

      <div className="summary">
        <div className="summary-line">
          <label>Total Income</label>
          <h2>{formatMoney(grandTotalIncome)}</h2>
        </div>
        <div className="summary-line">
          <label>Total Spending</label>
          <h2>{formatMoney(grandTotalExpenses)}</h2>
        </div>
        <hr />
        <div className="summary-line">
          <label>Bottom Line</label>
          <h2>{formatMoney(net)}</h2>
        </div>
      </div>
    </div>
  )
}

const handleDateRangeChange = ({ startDate, endDate }) => {
  transactionsContainer.getTransactions(startDate, endDate)
}

const initialValues = { startDate: '2019-01-01', endDate: '2019-02-01' }

const Transactions = () => (
  <main className="transactions-view">
    <h1>Transactions</h1>
    
    <Form
      onSubmit={handleDateRangeChange}
      validate={validateDateRange}
      initialValues={initialValues}
      render={({ handleSubmit, pristine, invalid }) => (
        <form className="date-range-form" onSubmit={handleSubmit}>
          <div className="fieldset-wrapper">
            <div className="field-wrapper">
              <label>From</label>
              <DatePickerField name="startDate" />
            </div>
            <div className="field-wrapper">
              <label>To</label>
              <DatePickerField name="endDate" />
            </div>
            <button 
              disabled={pristine || invalid}
              onClick={handleSubmit}
            >
              filter
            </button>
          </div>
        </form>
      )}
    />

    <InstitutionsSubscriber>{() => {
      transactionsContainer.getTransactions()
      return (
        <TransactionsSubscriber>{() => (
          <TransactionsByCategory />
        )}</TransactionsSubscriber>
      )
    }}</InstitutionsSubscriber>
  </main>
)

export default Transactions