import React from 'react';
import { connect } from 'react-redux'
import * as actions from '../../actions'
import PaymentForm from './PaymentForm';

import styles from './home.scss'


class Home extends React.PureComponent {
  componentDidMount() {
  	this.props.dispatch(actions.getPaymentDetails())
  }

  handleSubmitForm = (values)=> {
  	console.log(values)
  	const otherValues = this.props.paymentDetails.createTransactionRequest;
  	this.props.dispatch(actions.sendPayment({...values, ...otherValues}))
  }

  getTransactions = ()=> {
  	this.props.dispatch(actions.getTransactions())
  }


  
  render() {
  	const { paymentDetails } = this.props;
  	const item = paymentDetails && paymentDetails.createTransactionRequest.transactionRequest.lineItems.lineItem;
  	const shipTo = paymentDetails && paymentDetails.createTransactionRequest.transactionRequest.shipTo;
  	const cardDetails = paymentDetails.createTransactionRequest.transactionRequest.payment.creditCard
  	
  	console.log(paymentDetails)
    
    return (
      <div className="container">
			  <div className="row">
			  	{ paymentDetails.payment  ?
			  	
			  	<React.Fragment>
			  		{ paymentDetails.payment.status ?
					  	<div className="col text-center">
				        <br /><br /> <h2 style={{color:'#0fad00'}}>Payment Success</h2>
				        <a className="btn btn-success" onClick={this.getTransactions}>Fetch Payment History From Database</a>

				        <table className="table" style={{marginTop: 20}}>
							    <thead>
							      <tr>
							      	<th>SN.</th>
							        <th>Transaction ID</th>
							        <th>Debited From</th>
							        <th>Card Type</th>
							      </tr>
							    </thead>
							    <tbody>
							    {paymentDetails.transactions.map((data, index)=> {
							    	let result = data.data.substring(1, data.data.length-1);
							    	const finalResult = JSON.parse(result);
							    	console.log(finalResult)
							    	return(
								      <tr key={index}>
								        <td>{index+1}</td>
								        <td>{finalResult.transactionResponse.transHash}</td>
								        <td>{finalResult.transactionResponse.accountNumber}</td>
								        <td>{finalResult.transactionResponse.accountType}</td>
								      </tr>
							    	)
							    })}
							    </tbody>
							  </table>
							</div> :

							<div className="col text-center">
				        <br /><br /> <h2 style={{color:'red'}}>Payment Failed</h2>
				        <h4 style={{color:'red'}}>{paymentDetails.payment.message}</h4>
							</div>
						}
					</React.Fragment>
					:
			    <React.Fragment>
				    <div className="col" style={{padding: 30}}>
				      
				    	<div className="list-group">
							  <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">
							    <div className="d-flex w-100 justify-content-between">
							      <h6 className="mb-1"><b>ITEMS</b></h6>
							      <small>ITEM ID: {item.itemId}</small>
							    </div>
							    <p style={{fontSize: 12}} className="mb-1">PRODUCT NAME: <b>{item.name}</b></p>
							    <small>PRICE: <b>{item.unitPrice}</b></small> <br/ >
							    <small style={{fontSize: 12}}>QUANTITY: <b>{item.quantity}</b></small><br/ >

							    <small style={{fontSize: 12}}>DISCOUNTED PRICE: <b>76500</b></small><br/ >
							    <small style={{fontSize: 12}}>COUPON CODE:  <b style={{color: '#078207'}}>SALE50 (-2500)</b></small>
							  </a>
							  <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">
							    <div className="d-flex w-100 justify-content-between">
							      <h5 className="mb-1">Shipping Details:</h5>
							    </div>
							    <small className="text-muted">{`${shipTo.firstName} ${shipTo.lastName} , ${shipTo.address}, ${shipTo.city}, ${shipTo.country}, ${shipTo.zip}`}</small>
							  </a>
							</div>
				    </div>
				    <div className="col">
				      <div key="Payment">
				        <div className="App-payment">
				          <PaymentForm onSubmit={this.handleSubmitForm} initialValues={{cardNumber: cardDetails.cardNumber, expirationDate: cardDetails.expirationDate}} isLoading={paymentDetails.isLoading} />
				        </div>
				      </div>
				      
				    </div> 
			    </React.Fragment> }

			  </div>
			</div>

    );
  }
}

function mapStateToProps(state){
    return {
      paymentDetails: state.payment
    }
}

export default connect(
  mapStateToProps
)(Home)