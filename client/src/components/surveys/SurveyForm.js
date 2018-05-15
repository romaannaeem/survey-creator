// SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
  renderFields() {
    // For every field we map over, return a custom field. This is just to condense our code a bit, so we don't have to have 4 Field components
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)} // Comes from SurveyNew.js
        >
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  // If any of the property names on the error object match up with a field name, redux form automatically takes the error and passes it as a prop to that field

  // if (!values.title) {
  //   errors.title = 'You must provide a title';
  // }

  // if (!values.subject) {
  //   errors.subject = 'You must provide a subject line';
  // }

  // if (!values.body) {
  //   errors.body = 'You must provide an email body';
  // }

  errors.recipients = validateEmails(values.recipients || ''); // Provide an empty string b/c validate runs once upon start, and split function doesn't expect an undefined

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false // After cancel form and go back, the form data will stay
})(SurveyForm);
