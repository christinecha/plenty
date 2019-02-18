import React from 'react'
import { InstitutionsSubscriber } from '../containers/institutionsContainer'

const Account = ({ account }) => {
  const { balances } = account

  return (
    <div className="account">
      {account.name}
      {console.log(account)}
      <div className="balance">
        <span>AVAILABLE: {balances.available}</span>
        <span>CURRENT: {balances.current}</span>
      </div>
    </div>
  )
}

const Accounts = ({ accounts }) => (
  <div className="accounts">
    {accounts.map(account => (
      <Account
        key={account.account_id}
        account={account}
      />
    ))}
  </div>
)

const Institution = ({ institution }) => (
  <div className="institution">
    {institution.id}
    {institution.name}
    {console.log(institution)}
    <Accounts accounts={institution.accounts} />
  </div>
)

const Institutions = ({ institutions }) => (
  <section className="institutions">
    {institutions.map(institution => (
      <Institution
        key={institution.id}
        institution={institution}
      />
    ))}
  </section>
)

const Overview = () => (
  <main>
    <h1>Overview</h1>

    <InstitutionsSubscriber>{({ state }) => {
      return <Institutions institutions={state.institutions} />
    }}</InstitutionsSubscriber>
  </main>
)

export default Overview