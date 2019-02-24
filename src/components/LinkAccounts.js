import axios from 'axios'
import { PLAID_PUBLIC_KEY } from '../../env'

// get access tokens from 
var handler = Plaid.create({
  clientName: 'Plaid Quickstart',
  env: 'development',
  key: PLAID_PUBLIC_KEY,
  product: ['transactions'],
  // webhook: 'https://requestb.in',
  language: 'en',
  user: {
    legalName: 'Christine Cha',
    emailAddress: 'hello@christinecha.com',
  },
  onLoad: function () {
    // Optional, called when Link loads
  },
  onSuccess: function (public_token, metadata) {
    axios.post('/get_access_token', { public_token, ...metadata })
      .then(res => {
        console.log(res)
      })
  },
  onExit: function (err, metadata) {
    // The user exited the Link flow.
    if (err != null) {
      // The user encountered a Plaid API error prior to exiting.
    }
    // metadata contains information about the institution
    // that the user selected and the most recent API request IDs.
    // Storing this information can be helpful for support.
  },
  onEvent: function (eventName, metadata) {
    // Optionally capture Link flow events, streamed through
    // this callback as your users connect an Item to Plaid.
    // For example:
    // eventName = "TRANSITION_VIEW"
    // metadata  = {
    //   link_session_id: "123-abc",
    //   mfa_type:        "questions",
    //   timestamp:       "2017-09-14T14:42:19.350Z",
    //   view_name:       "MFA",
    // }
  }
})

document.getElementById('link-button').addEventListener('click', function (e) {
  handler.open()
})