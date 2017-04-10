// @flow
import React from 'react';

/* eslint-disable react/prop-types */
/* eslint-disable flowtype-errors/show-errors */
const renderField = ({ input, label, type, meta: { touched, error, invalid, warning } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label htmlFor={input.name} className="control-label">{label}</label>
    <div>
      <input htmlFor={input.name} {...input} className="form-control" placeholder={label} type={type} />
      <div className="help-block">
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  </div>
);

export default renderField;
