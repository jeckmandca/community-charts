import {Elements} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { STRIPE_PUBLISH_KEY } from '../../../utils/constant';
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);

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

const PaymentFormWrapper = ({
  setIsModalOpenOrder,
  formData,
  priceId,
  setCurrentPlanOfCustomer,
  planData,
  setTaxAmount,
  setTotalAmount,
  getCouponValue,
  couponObject
}: any) => (
  <Elements stripe={stripePromise} options={options}>
    <PaymentForm
      setIsModalOpenOrder={setIsModalOpenOrder}
      formData={formData}
      priceId={priceId}
      setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
      planData={planData}
      setTaxAmount={setTaxAmount}
      setTotalAmount={setTotalAmount}
      getCouponValue={getCouponValue}
      couponObject={couponObject} />
  </Elements>
);

export default PaymentFormWrapper;
