import React from 'react'

class StateProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.initialValue
    }
  }

  setValue = (value) => {
    this.setState({ value })
  }

  render() {
    const { children } = this.props
    return children(this.state.value, this.setValue)
  }
}

export default StateProvider