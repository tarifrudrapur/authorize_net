import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import paymentReducer from './reducers'

const configureStore = (props) => (
  createStore(paymentReducer, props, applyMiddleware(thunk))
)

export default configureStore
