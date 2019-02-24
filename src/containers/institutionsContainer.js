import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'
import axios from 'axios'

class InstitutionsContainer extends Container {
  state = {
    institutions: []
  }

  getInstitutions() {
    axios.get('/api/institutions')
      .then(res => {
        const institutionPromises = Object.keys(res.data).map(key => {
          return axios.post('/get-balance', { institution_id: key })
            .then(({ data: accounts }) => {
              const institution = res.data[key]
              console.log(institution)
              return ({
                ...institution,
                id: key,
                accounts,
              })
            })
        })

        Promise.all(institutionPromises)
          .then(institutions => {
            this.setState({ institutions })
          })
      })
  }
}

const institutionsContainer = new InstitutionsContainer()
institutionsContainer.getInstitutions()

export default institutionsContainer

export const InstitutionsSubscriber = ({ children }) => (
  <Provider>
    <Subscribe to={[institutionsContainer]}>
      {children}
    </Subscribe>
  </Provider>
)