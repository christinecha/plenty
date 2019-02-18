import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import Overview from './Overview'
import Transactions from './Transactions'

const App = () => (
  <main>
    <header>
      <Link to="/transactions">Transactions</Link>
    </header>

    <Switch>
      <Route exact path="/" component={Overview} />
      <Route path="/transactions" component={Transactions} />
    </Switch>
  </main>
)

export default App