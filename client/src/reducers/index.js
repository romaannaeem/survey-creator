import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form'; // redux form automatically gives us this reducer
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';

export default combineReducers({
  auth: authReducer, // auth piece of state is being managed by authReducer
  form: reduxForm, // etc. ^^
  surveys: surveysReducer //etc. ^^
});
