import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Payments extends Component {
  render() {
    return (
      <StripeCheckout
        name="Emaily" // Header at top of payment window
        description="$5 for 5 email credits" // Description beneath header of payment window
        amount={500} // Gimme $5 USD
        token={token => this.props.handleToken(token)} // token property expects a callback function, calls it after we have recieved a callback token from Stripe API. HandleToken comes from the action creator.
        stripeKey={process.env.REACT_APP_STRIPE_KEY} // from .env file
      >
        <button className="btn">Add Credits</button>
      </StripeCheckout>
    );
  }
}

export default connect(null, actions)(Payments);
