import React, { Component, PropTypes } from 'react';
import moment from 'moment';

const renderField = ({ input, label, type, meta: { touched, error, invalid, warning } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label className="control-label">{label}</label>
    <div>{ console.log('input', input) }
      {type && type  === 'daate' ? (
        <span />
        // <SingleDatePicker
        //   date={input.value || null}
        //   onDateChange={date => input.value = date }
        //   focused={input.focused}
        //   onFocusChange={focused => input.focused = focused }
        // />
      ) : (
        <input {...input} className="form-control"  placeholder={label} type={type}/>
      )}
       <div className="help-block">
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  </div>
)

export default renderField;
