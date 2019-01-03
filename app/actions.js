/* eslint-disable import/prefer-default-export */

import * as types from './types'
import request from 'superagent';

export function getPaymentDetails() {
  return function (dispatch) {
    dispatch({type: types.PAYMENT_DETAILS});
  }
}

export function sendPayment(values) {
  return function (dispatch) {
      dispatch({type: types.PAYMENT})
      return request
        .post(`api/payment`)
        .send(values)
        .set('accept', 'json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
      	if(res.status) {
      		dispatch({type: types.PAYMENT_SUCCESS, data: res.body})
      	} else {
      		dispatch({type: types.PAYMENT_FAILED})
      	}
      	
    });
  }
}

export function getTransactions() {
  return function (dispatch) {
      return request
        .get(`api/payment`)
        .set('accept', 'json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
      		dispatch({type: types.GET_TRANSACTIONS, data: res.body.result})
    });
  }
}