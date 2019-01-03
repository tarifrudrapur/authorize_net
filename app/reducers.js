import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import * as types from './types'


const initialState = {
  createTransactionRequest: {
    "refId": "123456",
    "transactionRequest": {
      "transactionType": "authCaptureTransaction",
      "amount": "76500",
      "payment": {
        "creditCard": {
          "cardNumber": "5424000000000015",
          "expirationDate": "2020-12",
          "cardCode": "999"
        }
      },
      "lineItems": {
        "lineItem": {
          "itemId": "1",
          "name": "Apple iPhone X",
          "description": "Apple iPhone X Gold 64GB",
          "quantity": "1",
          "unitPrice": "79000"
        }
      },
      "tax": {
        "amount": "566",
        "name": "GST",
        "description": "18 % GST Applicable"
      },
      "shipping": {
        "amount": "100",
        "name": "Flat Shipping Charges",
        "description": "Fixed Shipping Amount"
      },
      "poNumber": "110001",
      "customer": {
        "id": "9045194166"
      },
      "shipTo": {
        "firstName": "Berry",
        "lastName": "Alen",
        "company": "Google",
        "address": "90 connaught place",
        "city": "Delhi",
        "state": "Delhi",
        "zip": "111001",
        "country": "INDIA"
      },
      "userFields": {
          "name": "discounts",
          "value": "2500"
      }
    }
  },
  transactions: [],
  isLoading: false,
  payment: null
}


const payment = (state = initialState, action) => {
    switch (action.type) {
      case types.PAYMENT_DETAILS:
        return {
          ...state
        }

      case types.GET_TRANSACTIONS:
        return {
          ...state,
          transactions: action.data,
        }
      case types.PAYMENT:
        return {
          ...state,
          isLoading: true,
        }

      case types.PAYMENT_SUCCESS:
        return {
          ...state,
          payment: action.data,
          isLoading: false
        }
      case types.PAYMENT_FAILED:
        return {
          ...state,
          isLoading: false
        }
      default:
        return state;
    }
};


const paymentReducer = combineReducers({ payment, form: formReducer })
const store = createStore(paymentReducer)

export default paymentReducer
