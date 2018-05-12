import axios from 'axios';
import { FETCH_USER } from './types';

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
  dispatch({ type: FETCH_USER, payload: res.data });
};
