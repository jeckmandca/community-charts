import { Button, Modal, Typography } from "antd";
import './RenewSubscription.css'

import { useState } from "react";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  ElementsConsumer
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { STRIPE_PUBLISH_KEY } from "../../../../utils/constant";
import { updateSubscription } from "../../../../services/StripeService";

const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);

const RenewSubscription = ({
  isModelOpenRenewDeclined,
  setModelOpenRenewDeclined,
  getSubDetailOfCustomer,
  setCurrentPlanOfCustomer
}: any) => {
  const { success } = Modal;
  const [errorPlan, setErrorPlan] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);

  const handleCancel = () => {
    setModelOpenRenewDeclined(false);
  };

  const options:any = {
    appearance: {
      theme: 'none',
      rules: {
        '.Label': {
          color: '#ebebeb',
          margin: '2px 0 10px 0',
          fontFamily: 'auto',
          fontSize: '15px'
        },

        '.Input': {
          marginBottom: '6px',
          outline: 'none'
        }
      },
      variables: {
        colorPrimary: 'red',
        colorBackground: 'white',
        colorDanger: 'red',
        fontFamily: 'comfortaa, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        fontSize: '1em',
        borderRadius: 'none',
        border: 'none',
        outline: 'none'
      }
    }
  };

  const handleSubmit = async (event: any, stripe: any, elements: any) => {
    setLoadingPlan(true);
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardNumberElement);
    const result = await stripe.createToken(card);

    if (result.error || result.errorPlan) {
      if (result.errorPlan) {
        setLoadingPlan(false);
        setErrorPlan(true);
        setMessage(result.errorPlan);
      }

      if (result.error) {
        setLoadingPlan(false);
        setErrorPlan(true);
        setMessage(result.error.message);
      }
      else {
        setLoadingPlan(false);
        setErrorPlan(true);
        setMessage('All fields are required!');
      }
    }
    else {
      let body: any = {};
      body.customer_id = getSubDetailOfCustomer.customer;
      body.subID = getSubDetailOfCustomer.id;
      body.token = result;

      const updatePayment = async () => {
        const data = await updateSubscription(body);

        if (data && data.status === 0) {
          setLoadingPlan(false);
          setErrorPlan(true);
          setMessage(data.message);
        }
        else {
          setLoadingPlan(false);
          setModelOpenRenewDeclined(false);
          setCurrentPlanOfCustomer('pro');
          success({
            content: (
              <div>
                {data.message}
              </div>
            )
          });
        }
      }
      updatePayment();
    }
  };

  return (
    <div>
      <Modal
        title={'Update payment method for Polarity Digital Advanced Subscription'}
        visible={isModelOpenRenewDeclined}
        footer={null}
        onCancel={handleCancel}>
        <div>
          <Typography className="text-declined">
            It seems there was an issue processing your recent payment for subscription renewal. To continue your subscription at your current rate, please update your payment method before this date {getSubDetailOfCustomer && getSubDetailOfCustomer.billing_cycle_anchor}.
          </Typography>

          <Elements stripe={stripePromise} options={options}>
            <ElementsConsumer>
              {({ stripe, elements }) => (
                <form onSubmit={(event) => handleSubmit(event, stripe, elements)}>
                  <div className="form_grp">
                    <Typography>Card Number</Typography>
                    <CardNumberElement className=".form_grp input"></CardNumberElement>
                  </div>

                  <div className="form_grp">
                    <Typography>Expiration Date</Typography>
                    <CardExpiryElement></CardExpiryElement>
                  </div>

                  <div className="form_grp">
                    <Typography>Security Code / CVV</Typography>
                    <CardCvcElement></CardCvcElement>
                  </div>

                  {errorPlan && <>
                    <div className="form_grp">
                      <Typography style={{ color: 'red' }}>{message}</Typography>
                    </div>
                  </>}

                  {loadingPlan === true ?
                    <Button htmlType="submit" className="subscribe-btn" loading>
                      Update Payment Method
                    </Button> :
                    <Button htmlType="submit" className="subscribe-btn">
                      Update Payment Method
                    </Button>
                  }
                </form>
              )}
            </ElementsConsumer>
          </Elements>
        </div>
      </Modal>
    </div>
  )
}

export default RenewSubscription
