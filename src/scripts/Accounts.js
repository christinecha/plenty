import axios from 'axios'

const accountsEl = document.getElementById('accounts')

const getTransactions = (institution_id) => {
  return axios.post('/get-transactions', { institution_id })
    .then(({ data }) => {
      console.log('transactions', data)
      return data
    })
}

const getBalance = (institution_id) => {
  return axios.post('/get-balance', { institution_id })
    .then(({ data }) => {
      console.log('balance', data)
      return data
    })
}

const getEl = (name, html) => {
  const el = document.createElement('div')
  el.classList.add('name')
  el.innerHTML = html
  return el
}

axios.post('/get-institutions')
  .then(res => {
    const institutions = res.data
    console.log(institutions)
    Object.keys(institutions).forEach(key => {
      const inst = institutions[key]

      Promise.all([
        getTransactions(key),
        getBalance(key)
      ]).then(([transactions, balances]) => {
        if (inst.accounts) {
          inst.accounts.forEach(account => {
            const accountEl = document.createElement('div')
            accountEl.classList.add('account')

            // const transactionsEl = document.createElement('div')
            // transactionsEl.classList.add('transactions')
            // transactionsEl.textContent = JSON.stringify(transactions)
            // accountEl.appendChild(transactionsEl)

            const match = balances.find(({ account_id }) => {
              return account_id === account.id
            })

            const balance = match.balances

            console.log('found', balance)

            const balanceEl = document.createElement('div')
            balanceEl.classList.add('balance')
            balanceEl.textContent = account.name + ' - ' + balance.current
            accountEl.appendChild(balanceEl)

            accountsEl.appendChild(accountEl)
          })
        }
      })
    })
  })



