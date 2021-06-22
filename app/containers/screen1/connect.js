import { compose } from 'recompose'
import { connect } from 'react-redux'




export default (container) => compose(
  connect(
    mapStateToProps,
    mapActionsToProps,
  )
)(container)
