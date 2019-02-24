const plaid = require('plaid')
const { routeFns } = require('../firebase/routes')
const { PLAID_PUBLIC_KEY } = require('../../env')

let secrets = {}

try {
  secrets = require('./secrets')
} catch (e) { }

const PLAID_CLIENT_ID = secrets.PLAID_CLIENT_ID || process.env.PLAID_CLIENT_ID
const PLAID_SECRET = secrets.PLAID_SECRET || process.env.PLAID_SECRET

const plaidClient = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments.development
)

const getAccessToken = (req, res) => {
  const { public_token, institution, ...rest } = req.body
  const { institution_id } = institution

  plaidClient.exchangePublicToken(
    public_token,
    (error, tokenResponse) => {
      if (error != null) {
        console.log('Could not exchange public_token!' + '\n' + error)
        return res.json(error)
      }
      const { access_token, item_id } = tokenResponse
      console.log('Access Token: ' + access_token)
      console.log('Item ID: ' + item_id)

      routeFns.put(`institutions/${institution_id}`)({
        ...institution,
        ...rest,
        access_token
      })

      res.json(tokenResponse)
    }
  )
}


const getTransactions = (req, res) => {
  const { institutionId, startDate, endDate } = req.body

  routeFns.get('institutions')()
  .then((institutions) => {
    const { access_token } = institutions[institutionId]
    const start_date = startDate || '2019-01-01'
    const end_date = endDate || '2019-02-01'

    console.log('getting', access_token)

    let allTransactions = []

    const continueGetting = (count = 500, page = 0) => {
      plaidClient.getTransactions(
        access_token,
        start_date,
        end_date,
        { count, offset: page * count },
        (err, plaidRes) => {
          if (err != null) {
            console.log('Could not get transactions!' + '\n' + JSON.stringify(err))
            return res.json(err)
          }

          allTransactions = allTransactions.concat(plaidRes.transactions)

          if (plaidRes.transactions.length === count) {
            continueGetting(count, page + 1)
          } else {
            res.json(allTransactions)
          }
        }
      );
    }

    continueGetting()
  })
}

const getBalance = (req, res) => {
  const { institution_id } = req.body

  routeFns.get(`institutions/${institution_id}`)()
  .then(({ access_token }) => {
    plaidClient.getBalance(access_token,
      (err, result) => {
        if (err != null) {
          console.log('Could not get balance!' + '\n' + JSON.stringify(err))
          return res.json(err)
        }

        res.json(result.accounts)
      }
    )
  })
}

const addRoutes = (app) => {
  app.post('/get_access_token', getAccessToken)
  app.post('/get-transactions', getTransactions)
  app.post('/get-balance', getBalance)
}

module.exports = addRoutes