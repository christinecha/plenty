import React, { Fragment } from 'react'
import axios from 'axios'
import institutionsContainer, { InstitutionsSubscriber } from '../containers/institutionsContainer'
import transactionsContainer, { TransactionsSubscriber } from '../containers/transactionsContainer'
import RefProvider from './util/RefProvider'
import { formatMoney } from '../util/formatters'

const Transaction = ({ transaction }) => (
  <div className="transaction">
    <span className="name">{transaction.name}</span>
    <span className="amount">{formatMoney(transaction.amount)}</span>
  </div>
)

const TransactionsByCategory = () => {
  const categories = transactionsContainer.transactionsByCategory

  return categories.map((mainCat, i) => {
    return (
      <div key={i} className="main-category">
        <h2>{mainCat.name}</h2>
        <h2>{mainCat.totalAmount}</h2>

        {mainCat.subcategories.map((subCat, j) => {
          return (
            <div key={j} className="sub-category">
              <h3>{subCat.name}</h3>
              <h3>{subCat.totalAmount}</h3>
              {subCat.transactions.map(t => (
                <Transaction key={t.transaction_id} transaction={t} />
              ))}
            </div>
          )
        })}
      </div>
    )
  })
}


const Month = () => (
  <TransactionsSubscriber>{({ state }) => (
    <section className="transactions">
      <TransactionsByCategory />
    </section>
  )}</TransactionsSubscriber>
)

const Transactions = () => (
  <main>
    <h1>Transactions</h1>
    <div>helloooo</div>

    <RefProvider>{(startDateRef) => (
      <RefProvider>{(endDateRef) => {
        const handleClick = () => {
          const start = startDateRef.current.value
          const end = endDateRef.current.value
          transactionsContainer.getTransactions(start, end)
        }

        return (
          <Fragment>
            <input ref={startDateRef} type="date" />
            <input ref={endDateRef} type="date" />
            <button onClick={handleClick}>filter</button>
          </Fragment>
        )
      }}</RefProvider>
    )}</RefProvider>

    <InstitutionsSubscriber>{({ state }) => {
      transactionsContainer.getTransactions()
      return <Month />
    }}</InstitutionsSubscriber>
  </main>
)

export default Transactions