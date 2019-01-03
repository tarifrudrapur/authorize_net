/* eslint consistent-return:0 */

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./util//logger');

const argv = require('./util/argv');
const port = require('./util//port');
const setup = require('./middlewares/frontendMiddleware');
const { resolve } = require('path');
const constants = require('./util/constants.js');
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : constants.databaseUser,
  password : constants.databasePassword,
  database : constants.databaseName
});

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/api/payment', (req, res) => {
 
	connection.query('SELECT * FROM payments', function (error, results, fields) {
	  if (error) throw error;
	  res.json({status: true, result: results}); 
	});
	 
})


// API
app.post('/api/payment', (req, res) => {

	var params =  req.body;

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var creditCard = new ApiContracts.CreditCardType();
	creditCard.setCardNumber(params.cardNumber);
	creditCard.setExpirationDate(params.expirationDate);
	creditCard.setCardCode(params.cardCode);

	var paymentType = new ApiContracts.PaymentType();
	paymentType.setCreditCard(creditCard);

	var orderDetails = new ApiContracts.OrderType();
	orderDetails.setInvoiceNumber('INV-12345');
	orderDetails.setDescription('Product Description');

	var tax = new ApiContracts.ExtendedAmountType();
	tax.setAmount(params.transactionRequest.tax.amount);
	tax.setName(params.transactionRequest.tax.name);
	tax.setDescription(params.transactionRequest.tax.description);

	var shipping = new ApiContracts.ExtendedAmountType();
	shipping.setAmount(params.transactionRequest.shipping.amount);
	shipping.setName(params.transactionRequest.shipping.name);
	shipping.setDescription(params.transactionRequest.shipping.description);

	var shipTo = new ApiContracts.CustomerAddressType();
	shipTo.setFirstName(params.transactionRequest.shipTo.firstName);
	shipTo.setLastName(params.transactionRequest.shipTo.lastName);
	shipTo.setCompany(params.transactionRequest.shipTo.company);
	shipTo.setAddress(params.transactionRequest.shipTo.address);
	shipTo.setCity(params.transactionRequest.shipTo.city);
	shipTo.setState(params.transactionRequest.shipTo.state);
	shipTo.setZip(params.transactionRequest.shipTo.zip);
	shipTo.setCountry(params.transactionRequest.shipTo.country);

	var lineItem_id1 = new ApiContracts.LineItemType();
	lineItem_id1.setItemId(params.transactionRequest.lineItems.lineItem.itemId);
	lineItem_id1.setName(params.transactionRequest.lineItems.lineItem.name);
	lineItem_id1.setDescription(params.transactionRequest.lineItems.lineItem.description);
	lineItem_id1.setQuantity(params.transactionRequest.lineItems.lineItem.quantity);
	lineItem_id1.setUnitPrice(params.transactionRequest.lineItems.lineItem.unitPrice);

	var lineItemList = [];
	lineItemList.push(lineItem_id1);

	var lineItems = new ApiContracts.ArrayOfLineItem();
	lineItems.setLineItem(lineItemList);

	var userField_a = new ApiContracts.UserField();
	userField_a.setName(params.transactionRequest.userFields.name);
	userField_a.setValue(params.transactionRequest.userFields.value);

	var userFieldList = [];
	userFieldList.push(userField_a);

	var userFields = new ApiContracts.TransactionRequestType.UserFields();
	userFields.setUserField(userFieldList);


	var transactionRequestType = new ApiContracts.TransactionRequestType();
	transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
	transactionRequestType.setPayment(paymentType);
	transactionRequestType.setAmount(params.transactionRequest.amount);
	transactionRequestType.setLineItems(lineItems);
	transactionRequestType.setUserFields(userFields);
	transactionRequestType.setOrder(orderDetails);
	transactionRequestType.setTax(tax);
	transactionRequestType.setShipping(shipping);
	transactionRequestType.setShipTo(shipTo);

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setTransactionRequest(transactionRequestType);
		
	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
	//Defaults to sandbox
	//ctrl.setEnvironment(SDKConstants.endpoint.production);

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				if(response.getTransactionResponse().getMessages() != null){
					var result = JSON.stringify(response);
					connection.query('INSERT INTO payments(data) VALUES("?")', [result], function (error, results, fields) {
					  if (error) throw error;
					  res.json({status: true, message: response.getTransactionResponse().getMessages().getMessage()[0].getCode()}); 
					});
				}
				else {
					if(response.getTransactionResponse().getErrors() != null){
						res.json({status: false, message: response.getTransactionResponse().getErrors().getError()[0].getErrorText()}); 
					}
				}
			}
			else {
				if(response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null){
					res.json({status: false, message: response.getTransactionResponse().getErrors().getError()[0].getErrorText()}); 
				}
				else {
					res.json({status: false, message: response.getMessages().getMessage()[0].getText()}); 
				}
			}

	});
  
})

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }
  logger.appStarted(port, prettyHost);
});
