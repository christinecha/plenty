import React, { Fragment } from 'react'
import { Form, Field } from 'react-final-form'
import axios from 'axios'
import Modal from '../Modal'
import TransactionRules from '../TransactionRules'
import TransactionRule from '../TransactionRules/TransactionRule'
import StateProvider from '../util/StateProvider'
import { formatMoney } from '../../util/formatters'

const Transaction = ({ transaction }) => (
  <div className="transaction-info">
    <h2>Transaction Details</h2>
    <TransactionRule 
      rule={{ 
        isGlobal: false,
        transactionId: transaction.transaction_id,
        properties: { 
          ...transaction,
        }
      }} 
      isEditing
    />
    
    <div className="fieldset-wrapper">
      <div className="field-wrapper">
        <label>Amount</label>
        <p>{formatMoney(transaction.amount)}</p>
      </div>
    </div>
  </div>
)

const TransactionModal = ({ 
  isActive,
  onClickOverlay,
  transaction,
}) => {
  const ruleFilter = rule => (
    rule.isGlobal
      && rule.match
      && transaction.name.indexOf(rule.match) > -1
  )

  return (
    <Modal isActive={isActive} onClickOverlay={onClickOverlay}>
      <StateProvider>{(contentType, setContent) => {

        const contentMap = {
          RULES: <TransactionRules filter={ruleFilter} />,
          TRANSACTION: <Transaction transaction={transaction} />
        }

        return (
          <Fragment>
            <button onClick={() => setContent('RULES')}>
              see all related rules
            </button>
            <button onClick={() => setContent('TRANSACTION')}>
              see transaction
            </button>

            {contentMap[contentType] || contentMap.TRANSACTION}
          </Fragment>
        )
      }}</StateProvider>
    </Modal>
  )
}

export default TransactionModal