import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'
import axios from 'axios'
import institutionsContainer from './institutionsContainer'

class TransactionsContainer extends Container {
  state = {
    transactions: []
  }

  get transactionsByCategory() {
    const { transactions } = this.state

    const obj = {}

    transactions.forEach(t => {
      let last = obj

      const cats = t.category || []
      const main = cats[0] || 'Miscellaneous'
      const sub = cats[1] || 'General'

      obj[main] = obj[main] || {}
      obj[main][sub] = obj[main][sub] || {}
      obj[main][sub].transactions = obj[main][sub].transactions || []

      obj[main][sub].transactions.push(t)
    })

    const categories = Object.keys(obj).map(main => {
      const val = obj[main]
      let totalAmount = 0

      const subcategories = Object.keys(val).map(sub => {
        let subtotal = val[sub].transactions.reduce((sum, t) => sum + t.amount, 0)
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
        subcategories
      }
    })

    return categories.sort((a, b) => a.totalAmount - b.totalAmount)
  }

  getTransactions = (
    startDate,
    endDate
  ) => {
    console.log('request transactions')

    const { institutions } = institutionsContainer.state
    const promises = institutions.map(({ id }) => {
      const params = {
        institutionId: id,
        startDate,
        endDate
      }

      return axios.post('/get-transactions', params)
        .then(({ data }) => {
          console.log('transactions', data)
          return data
        })
    })

    Promise.all(promises)
      .then(transactionArrs => {
        const allTransactions = transactionArrs.reduce((arr, t) => arr.concat(t), [])
        console.log(allTransactions)
        this.setState({ transactions: allTransactions })
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