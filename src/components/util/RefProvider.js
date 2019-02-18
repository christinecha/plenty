import React from 'react'

class RefProvider extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
  }

  render() {
    const { children } = this.props
    return children(this.ref)
  }
}

export default RefProvider