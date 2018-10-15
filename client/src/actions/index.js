import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

// Returns function w/ Redux Thunk

// const fetchUser = () => {
//   return function(dispatch) {
//     axios
//       .get('/api/current_user')
//       .then(res => dispatch({ type: FETCH_USER, payload: res }));
//   };
// };

// EQUIVALENT

// export const fetchUser = () => async dispatch => {
//   const res = await axios.get('/api/current_user');

//   dispatch({ type: FETCH_USER, payload: res });
// };

// EQUIVALENT

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

// Takes token we get from Stripe & sends it to the back end server
export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  // Res.data gives back user from DB. Contains credits, googleId, and some mongo variables. Corresponds to res.send(user) from the billingRoutes.js file
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);

  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};
