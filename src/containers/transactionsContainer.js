import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'
import axios from 'axios'
import institutionsContainer from './institutionsContainer'

class TransactionsContainer extends Container {
  state = {
    transactions: [],
    transactionRules: []
  }

  get transactionRules () {
    return this.state.transactionRules
  }

  get transactions () {
    return this.state.transactions.map(t => {
      const specificRules = []
      const globalRules = []

      this.transactionRules.forEach(rule => {
        if (rule.transactionId === t.transaction_id) {
          specificRules.push(rule)
        }

        if (
          rule.isGlobal
            && rule.match 
            && t.name
            && t.name.indexOf(rule.match) > -1
        ) {
          globalRules.push(rule)
        }
      })

      const originalCategory = t.category || []
      let modifiedTransaction = { 
        ...t,
        mainCategory: t.mainCategory || t.category[0] || 'Miscellaneous',
        subCategory: t.subCategory || t.category[1] || 'General',
      }
      delete modifiedTransaction.category

      const applyRule = (rule) => {
        const properties = rule.properties || {}

        modifiedTransaction = {
          ...modifiedTransaction,
          mainCategory: properties.mainCategory || modifiedTransaction.mainCategory,
          subCategory: properties.subCategory || modifiedTransaction.subCategory,
          name: properties.name || modifiedTransaction.name,
          isHidden: properties.isHidden
        }
      }

      globalRules.forEach(applyRule)
      specificRules.forEach(applyRule)
      return modifiedTransaction
    }).filter(t => !t.isHidden)
  }

  get transactionsByCategory() {
    const obj = {}

    this.transactions.forEach(t => {
      const main = t.mainCategory
      const sub = t.subCategory

      obj[main] = obj[main] || {}
      obj[main][sub] = obj[main][sub] || {}
      obj[main][sub].transactions = obj[main][sub].transactions || []

      obj[main][sub].transactions.push(t)
    })

    const categories = Object.keys(obj).map(main => {
      const val = obj[main]
      let totalAmount = 0
      let totalExpenses = 0
      let totalIncome = 0

      const subcategories = Object.keys(val).map(sub => {
        let subtotal = val[sub].transactions.reduce((sum, t) => {
          if (t.amount < 0) totalExpenses += t.amount
          if (t.amount > 0) totalIncome += t.amount
          return sum + t.amount
        }, 0)
        totalAmount += subtotal

        return {
          name: sub,
          transactions: val[sub].transactions,
          totalAmount: subtotal
        }
      })

      return {
        name: main,
        totalAmount,
        totalExpenses,
        totalIncome,
        subcategories
      }
    })

    return categories.sort((a, b) => (
      Math.abs(b.totalAmount) - Math.abs(a.totalAmount)
    ))
  }

  getTransactions = (
    startDate,
    endDate
  ) => {

    const { institutions } = institutionsContainer.state
    const promises = institutions.map(({ id }) => {
      const params = {
        institutionId: id,
        startDate,
        endDate
      }

      return axios.post('/get-transactions', params)
        .then(({ data: transactions }) => {
          return transactions.map(t => ({
            ...t,
            amount: t.amount * -1
          }))
        })
    })

    axios.get('/api/transaction-rules')
    .then(({ data }) => {
      const transactionRules = Object.values(data)

      Promise.all(promises)
      .then(transactionArrs => {
        const allTransactions = transactionArrs.reduce((arr, t) => arr.concat(t), [])

        this.setState({ 
          transactions: allTransactions,
          transactionRules
        })
      })
    })
  }
}

const transactionsContainer = new TransactionsContainer()

export default transactionsContainer

export const TransactionsSubscriber = ({ children }) => (
  <Provider>
    <Subscribe to={[transactionsContainer]}>
      {children}
    </Subscribe>
  </Provider>
)