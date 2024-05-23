import { Button, Col, Row, Tabs, Typography } from "antd";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import './Account.css';

import { getPaymentDetail, getSubscription } from "../../services/StripeService";
import { formatDate } from "../../utils/metricsFormatting";

import PricingPopUp from "./pricing/PricingPopUp";
import CancelPopUp from "./confirmations/CancelPopUp";
import SuccessPopUp from "./confirmations/SuccessPopUp";
import UpdatePayment from "./subscription/UpdatePayment/UpdatePayment";

const { TabPane } = Tabs;

export const Account = ({
  currentPlan,
  setCurrentPlanOfCustomer,
  setSubStatus
}: any) => {
  let location = useLocation();
  const { user } = useAuth0();

  const [isModelOpenPrice, setIsModelOpenPrice] = useState(false);
  const [isModelOpenDelete, setIsModelOpenDelete] = useState(false);
  const [isModelOpenRenew, setIsModelOpenRenew] = useState(false);
  const [isModelOpenPayment, setIsModelOpenPayment] = useState(false);
  const [subId, setSubId] = useState('');

  const activeTab = location?.state?.activeTab ? location.state.activeTab : 'Account';

  const [customerData, setCustomerData] = useState({
    plan: {
      amount: 0,
      interval: ''
    },
    status: 'inactive',
    current_period_end: 0,
    cancel_at_period_end: false,
    id: null
  });

  const [paymentDetails, setPaymentDetails] = useState({
    funding: '',
    last4: '',
    exp_month: '',
    exp_year: ''
  });

  useEffect(() => {
    let data: any = {};
    let stringDate: string;
    let date: any;

    const getCustomerDetails = async () => {
      data = await getSubscription();
      date = new Date(data && data.current_period_end * 1000);

      if (date) {
        stringDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }

      if (data) {
        setSubStatus(data.status);
        data.billing_cycle_anchor = stringDate;
      }

      if (data?.discount?.coupon?.amount_off) {
        data.plan.amount = data.plan.amount - data.discount.coupon.amount_off;
      }

      setCustomerData(data);

      if (data?.plan?.nickname && data.status === 'active')
        setCurrentPlanOfCustomer(data.plan.nickname);
      else
        setCurrentPlanOfCustomer('free');

      return data;
    }

    getCustomerDetails();
  }, [
    currentPlan,
    user,
    isModelOpenPrice,
    isModelOpenDelete,
    isModelOpenRenew
  ]);

  useEffect(() => {
    let payment: any = '';

    const getPayment = async () => {
      if (user && user.email) {
        payment = await getPaymentDetail();
        setPaymentDetails(payment);
      }
    }
    getPayment();
  }, [user && user.email, currentPlan])

  const handleCancelSubscription = (subID: any) => {
    setSubId(subID);
    setIsModelOpenDelete(true);
  }

  const handleUpgrade = () => {
    setIsModelOpenPrice(true);
  }

  const handleOnChangeTab = () => {}

  const handleRenew = (date: any, subID: any) => {
    setSubId(subID);
    setIsModelOpenRenew(true);
  }

  const handleUpdatePayment = () => {
    setIsModelOpenPayment(true);
  }

  return (
    <>
      <div className="mini_container">
        <Tabs
          defaultActiveKey={activeTab === 'Billing' ? '2' : '1'}
          onChange={() => handleOnChangeTab()}>
          <TabPane tab="Account" key="1">
            <div className="panel tab_1">
              <div className="content_box">
                <div className="content_header">
                  <h1>Personal Details</h1>
                </div>

                <div className="content_body c_body_1">
                  <Row>
                    <Col>Email</Col>
                    <Col><label>{user && user.email}</label></Col>
                  </Row>
                  <p>To update your email please contact us at support@polaritydigital.io</p>
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tab="Billing" key="2">
            <div className="panel tab_1">
              <div className="content_box">
                <div className="content_header">
                  <h1>Current Subscription
                    {currentPlan === 'free' &&
                      <Button
                        className="btn_upgrade"
                        onClick={() => handleUpgrade()}>Upgrade</Button>
                    }
                  </h1>
                </div>

                <div className="content_body c_body_1">
                  <Row>
                    <Col>Plan</Col>
                    <Col><label>{currentPlan === 'free' ? 'Basic Access' : 'Polarity Digital Pro'}</label></Col>
                  </Row>

                  <Row>
                    <Col>Price</Col>
                    <Col><label>{customerData && customerData.plan && customerData.status !== 'incomplete' && customerData.status !== 'incomplete_expired' ? `$${(customerData.plan.amount/100).toFixed(2)}` : '$0.00'}</label></Col>
                  </Row>

                  <Row>
                    <Col>Billing Period</Col>
                    <Col><label>{customerData && customerData.plan && customerData.status !== 'incomplete' && customerData.status !== 'incomplete_expired' && customerData.plan.interval === 'month' ? 'Monthly (Billing will automatically recur on your expiration day.)' : customerData && customerData.plan && customerData.plan.interval === 'year' ? 'Yearly (Billing will automatically recur on your expiration day.)' : '__'}</label></Col>
                  </Row>

                  <Row>
                    <Col>Expiration</Col>
                    <Col><label>{currentPlan === 'pro' && customerData ? `${formatDate(new Date(customerData.current_period_end * 1000).toUTCString())} ${customerData.cancel_at_period_end ? '(You renew your membership before expiration date)' : ''}` : '__'}</label></Col>
                  </Row>

                  <Row className="">
                    <Col>Status</Col>
                    <Col className="col_calc">
                      {
                        currentPlan === 'pro' && customerData?.cancel_at_period_end ?
                        <label className="pro-text">Membership canceled - subscription ends on ${formatDate(new Date(customerData.current_period_end * 1000).toUTCString())} Would you like to renew your membership?</label>
                        : currentPlan === 'pro' ?
                        <label className="pro-button">Pro Access-Active</label> :
                        <label className="pro-button">Basic Access-Active</label>
                      }

                      <br></br>

                      {customerData?.cancel_at_period_end &&
                        <Button onClick={() => handleRenew(formatDate(new Date(customerData.current_period_end * 1000).toUTCString()), customerData && customerData.id)}>Renew</Button>
                      }
                    </Col>
                  </Row>
                </div>
              </div>

              {currentPlan === 'pro' &&
                <div className="content_box">
                  <div className="content_header">
                    <h1>Billing Details
                    </h1>
                  </div>

                  <div className="content_body c_body_1">
                    <Row>
                      <Col>Payment method</Col>
                      <Col>{paymentDetails?.funding} card</Col>
                    </Row>

                    <Row>
                      <Col>Card Number</Col>
                      <Col>**** **** **** {paymentDetails?.last4}</Col>
                    </Row>

                    <Row>
                      <Col>Expiration</Col>
                      <Col>{paymentDetails?.exp_month} / {paymentDetails?.exp_year}</Col>
                    </Row>

                    <Row className="">
                      <Col className="col_calc1">
                        <Button
                          onClick={() => { handleUpdatePayment() }}>Update Payment Details</Button>
                        <br></br>
                      </Col>
                    </Row>

                    <Row>
                      <label>Note: Currently it is not possible to change your billing address automatically. Please contact us at support@polaritydigital.io and our team will be happy to help.</label>
                    </Row>
                  </div>
                </div>
              }

              {currentPlan === 'pro' && customerData?.status === 'active' &&
                <div className="content_box">
                  <div className="content_body">
                    <Row className="row_end">
                      <Col>
                        <Typography className="cancel_sub">Cancel your subscription</Typography>
                      </Col>

                      <Col>
                        <Button
                          className="btn_default"
                          onClick={() => { handleCancelSubscription(customerData && customerData.id) }}>Cancel My Subscription</Button>
                      </Col>
                    </Row>
                  </div>
                </div>}
            </div>
          </TabPane>
        </Tabs>
      </div>

      <PricingPopUp
        isModelOpenPrice={isModelOpenPrice}
        setIsModelOpenPrice={setIsModelOpenPrice}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        currentPlanOfCustomer={currentPlan}
        customerData={customerData} />

      <CancelPopUp
        isModelOpenCancel={isModelOpenDelete}
        setIsModelOpenCancel={setIsModelOpenDelete}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        subID={subId}
        expireDate={customerData && formatDate(new Date(customerData.current_period_end * 1000).toUTCString())}
        user={user} />

      <SuccessPopUp
        isModelOpenRenew={isModelOpenRenew}
        setIsModelOpenRenew={setIsModelOpenRenew}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        subID={subId}
        expireDate={customerData && formatDate(new Date(customerData.current_period_end * 1000).toUTCString())}
        user={user} />

      <UpdatePayment
        isModelOpenPayment={isModelOpenPayment}
        setIsModelOpenPayment={setIsModelOpenPayment}
        user={user}
        setPaymentDetails={setPaymentDetails} />
    </>
  );
};
