import React, { Fragment } from 'react'
import { Form, Field } from 'react-final-form'
import axios from 'axios'
import Modal from '../Modal'
import StateProvider from '../util/StateProvider'
import { formatMoney } from '../../util/formatters'
import TransactionModal from './TransactionModal'

const Transaction = ({ transaction }) => {
  return (
    <StateProvider>{(isActive, setIsActive) => (
      <Fragment>
        <div className="transaction" onClick={() => setIsActive(true)}>
          <span className="name">{transaction.name}</span>
          <span className="amount">{formatMoney(transaction.amount)}</span>
        </div>

        <TransactionModal 
          transaction={transaction}
          isActive={isActive} 
          onClickOverlay={() => setIsActive(false)}
        />
      </Fragment>
    )}</StateProvider>
  )
}

export default Transaction