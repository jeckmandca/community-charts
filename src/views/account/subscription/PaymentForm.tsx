import { Modal, Button, Typography} from "antd";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  ElementsConsumer,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  AddressElement
} from "@stripe/react-stripe-js";
import axios from "axios";

import './OrderDetails.css'

import {
  calculateTax,
  createSubscription,
  savePaidCustomer
} from "../../../services/StripeService";

const PaymentForm = ({
  setIsModalOpenOrder,
  priceId,
  setCurrentPlanOfCustomer,
  planData,
  setTaxAmount,
  setTotalAmount,
  getCouponValue,
  couponObject
}: any) => {
  const { success } = Modal;

  const navigator = useNavigate();
  const location = useLocation();
  const { user } = useAuth0();

  const [errorPlan, setErrorPlan] = useState(false);
  const [message, setMessage] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [ip, setIp] = useState('');

  useEffect(() => {
    axios.get('https://ipapi.co/json/')
      .then((response) => {
        let data = response.data;
        let body: any = {}
        if (planData) {
          body.address = {
            line1: '',
            line2: null,
            city: data.city,
            country: data.country_name,
            postal_code: data.postal,
            state: data.city
          };
          body.amount = planData.unit_amount;
          body.currency = planData.currency;
          setCurrentCountry(data.country_code);
          setIp(data.ip);
        }
      });
  }, [user, planData]);

  const handleSubmit = async (event: any, stripe: any, elements: any) => {
    event.preventDefault();
    setLoadingPlan(true);

    if (!stripe || !elements) return;

    const addressElement = elements.getElement('address');
    const { complete, value } = await addressElement.getValue();
    const card = elements.getElement(CardNumberElement);
    const result = await stripe.createToken(card);
    if (complete === false) setLoadingPlan(false);

    if (result.error || result.errorPlan) {
      if (result.errorPlan) {
        setCurrentPlanOfCustomer('free');
        setLoadingPlan(false);
        setErrorPlan(true);
        setMessage(result.errorPlan);
      }

      if (result.error) {
        setCurrentPlanOfCustomer('free');
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
    else if (complete && !result.error && !result.errorPlan) {
      setErrorPlan(false);
      setMessage('');

      let body = {
        token: result.token.id,
        user: user,
        priceId: priceId,
        value,
        ip,
        code: getCouponValue,
        couponObject
      };

      let data = await createSubscription(body);

      if (data && data.status === 0) {
        setLoadingPlan(false);
        setErrorPlan(true);
        setMessage(data.message);
        setCurrentPlanOfCustomer('free');
      }
      else {
        stripe.confirmCardPayment(data.data.client_secret)
          .then((result: any) => {
            if (result.errorPlan) {
              setLoadingPlan(false);
              setErrorPlan(true);
              setMessage(result.errorPlan);
              setCurrentPlanOfCustomer('free');
            }

            if (result.error) {
              setLoadingPlan(false);
              setErrorPlan(true);
              setMessage(result.error.message);
              setCurrentPlanOfCustomer('free');
            }
            else if (result.paymentIntent) {
              setCurrentPlanOfCustomer('pro');
              success({
                content: (
                  <div>
                    Your payment was processed successfully. You account has been upgraded to a pro account, and you can now access all pro features on the website.
                  </div>
                ),
              });

              savePaidCustomer(body, 'active');
              setErrorPlan(false);
              setMessage('');
              setLoadingPlan(false);
              setIsModalOpenOrder(false);

              navigator(location.pathname, {
                state: {
                  currentPlan: 'pro',
                  activeTab: 'Billing'
                }
              });
            }
            else {
              setLoadingPlan(false);
              setErrorPlan(true);
              setMessage('Something went wrong!');
              setCurrentPlanOfCustomer('free');
            }
          });
      }
    }
  };

  const handleAddressChanges = (e: any) => {
    let body: any = {};

    if (e.complete) {
      body.address = e.value.address;
      body.amount = planData.unit_amount;
      body.currency = planData.currency;
    }

    const collectTax = async () => {
      if (body && body.currency) {
        let tax = await calculateTax(body);
        setTaxAmount(tax.tax_amount_exclusive);
        setTotalAmount(tax.amount_total);
      }
    }

    collectTax();
  }

  return (
    <>
      <div className="checkout-form">
        <AddressElement className="address-elements"
          options={
            {
              mode: 'billing',
              defaultValues: {
                address: {
                  country: currentCountry
                }
              }
            }
          }
          onChange={(e) => handleAddressChanges(e)} />

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
                  Subscribe Now
                </Button> :
                <Button htmlType="submit" className="subscribe-btn">
                  Subscribe Now
                </Button>}

              <Typography className="confirm-text">By confirming your subscription, you allow Polarity Digital to charge your card for this payment and future payments in accordance with their terms. You can always cancel your subscription.</Typography>
            </form>
          )}
        </ElementsConsumer>
      </div>
    </>
  );
}

export default PaymentForm;
