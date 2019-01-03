import React from 'react'
import { Field, reduxForm } from 'redux-form'

const required = value => (value ? undefined : 'Required');
const maxLength = value => value && value.length > 22 ? `Invalid Card` : undefined;
const CredtCardNormalizer = (value) => {
  if(value && value.length > 22) {
    return value.slice(0,-1);
  }

  if (!value) {
    return value
  }
  const onlyNums = value.replace(/[^\d]/g, '')

  if (onlyNums.length <= 4) {
    return onlyNums
  }
  if (onlyNums.length <= 8) {
    return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4)
  }
  if (onlyNums.length <= 12) {
      return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 8) + '-' + onlyNums.slice(8)
  }
  return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 8) + '-' + onlyNums.slice(8, 12)+ '-' + onlyNums.slice(12)
  
}

const expiryDate = (value) => {
  if(value && value.length > 7) {
    return value.slice(0, -1);
  }
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/[^\d]/g, '')
  if (onlyNums.length <= 4) {
    return onlyNums
  }
  if (onlyNums.length <= 4) {
    return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4)
  }
  return onlyNums.slice(0, 4) + '-' + onlyNums.slice(4, 6)
  
}

const cvvFormate = (value) => {
  const onlyNums = value.replace(/[^\d]/g, '')
  if(onlyNums && onlyNums.length > 3) {
    return onlyNums.slice(0, -1);
  } else {
    return onlyNums
  }
}



const renderField = ({
  input,
  label,
  placeholder,
  type,
  meta: { touched, error, warning }
}) => (
  <div style={{marginBottom: 20}}>
     <label>{label}</label>
    <input {...input} className="form-control" placeholder={placeholder} type={type} />
    {touched &&
      ((error && <span style={{color: 'red', fontSize: 10, position: 'absolute'}}>{error}</span>) ||
        (warning && <span style={{color: 'red', fontSize: 10, position: 'absolute'}}>{warning}</span>))}
  </div>
)


const PaymentForm = props => {
  const { handleSubmit, pristine, reset, submitting, isLoading } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name="cardNumber"
          component={renderField}
          label="Card Number"
          placeholder="5424-*"
          validate={[required]}
          format={CredtCardNormalizer}
        />
        </div>
        <div className="row">
          <div className="col-6">
            <Field
              name="expirationDate"
              className="form-control"
              component={renderField}
              label="Expiry Date"
              placeholder="YYYY/MM"
              format={expiryDate}
              validate={[required]}
            />
          </div>
          <div className="col-6">
            <Field
              name="cardCode"
              className="form-control"
              component={renderField}
              label="CVV"
              normalize={cvvFormate}
              placeholder="999"
              validate={[required]}
            />
          </div>
        </div>
      <div className="form-actions">
        <button className="btn btn-primary btn-block" type="submit" disabled={pristine || submitting || isLoading}>
          {isLoading ? 'PAYMENT PROCESSING...' : 'PAY' }
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'PaymentForm' // a unique identifier for this form
})(PaymentForm)