import {
  Modal,
  Typography,
  Button,
  Row,
  Col,
  Divider,
  Input,
  Dropdown,
  Space,
  Menu
} from "antd";
import { CloseOutlined } from "@ant-design/icons";

// @ts-ignore
import NewLogo from '../../../images/logo.png';
import './OrderDetails.css';

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { addPromoCode, getSinglePlan } from "../../../services/StripeService";
import PaymentFormWrapper from "./PaymentFormWrapper";

const OrderDetails = ({
  setIsModalOpen,
  isModalOpenOrder,
  setIsModalOpenOrder,
  priceId,
  setCurrentPlanOfCustomer
}: any) => {
  const [planData, setPlanData] = useState({
    id: '',
    nickname: '',
    unit_amount: 0,
    recurring: {
      interval: ''
    }
  });

  const { user } = useAuth0();

  const [taxAmount, setTaxAmount] = useState(0.00);
  const [totalAmount, setTotalAmount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponName, setCouponName] = useState('+ Add Discount');
  const [discount, setDiscount] = useState(0);
  const [validError, setValidError] = useState(false);
  const [getCouponValue, setCouponValue] = useState('');
  const [couponCode, setCouponCode] = useState("");
  const [couponObject, setCouponObject] = useState("coupon");

  useEffect(() => {
    if (priceId) {
      const stripePayment = async () => {
        let data: any = await getSinglePlan(priceId);
        setPlanData(data);
      };

      stripePayment();
    }
  }, [priceId]);

  const handleCancel = () => {
    setIsModalOpenOrder(false);
  };

  const handleUpgrade = () => {
    setIsModalOpenOrder(false);
    setIsModalOpen(true);
  };

  const closeDiscount = () => {
    setCouponError('');
    setValidError(false);
    setVisible(false);
  };

  const couponValue = (e: any) => {
    setCouponValue(e.target.value);
  };

  const applyCoupon = () => {
    const addPromo = async () => {
      let body = {
        user: user,
        code: getCouponValue.trim()
      };

      let data = await addPromoCode(body);

      if (data && data.status === 0) {
        setValidError(true);
        setCouponError(data.message);
        setDiscount(0);
        setCouponName("+ Add Discount");
      }
      else {
        setValidError(false);
        setCouponCode(data.data.id);
        setCouponName(data.data.object === 'coupon' ? data.data.id : data.data.code);
        setCouponObject(data.data.object);
        setDiscount(data.data.object === 'coupon' ? data.data.amount_off : data.data.coupon.amount_off);
        setTotalAmount(planData.unit_amount - (data.data.object === 'coupon' ? data.data.amount_off : data.data.coupon.amount_off));
        setCouponError('');
        setVisible(false);
      }
    }

    addPromo();
  }

  const addDiscount = () => {
    setCouponError('');
    setValidError(false);
    setVisible(!visible);
  }

  const handleScaleClick = (e: any) => {
    if (e.key === '1') {
      setVisible(true);
    }

    if (e.key === '2') {
      setCouponValue('');
      setCouponCode('');
      setDiscount(0);
      setCouponName("+ Add Discount");
    }
  };

  const scaleMenu = () => (
    <div>
      <Menu
        className="scale-menu3"
        onClick={(e: any) => handleScaleClick(e)}
        items={[
          {
            label: "Edit",
            key: "1"
          },
          {
            label: "Remove",
            key: "2"
          }
        ]} />
    </div>
  );

  return (
    <div>
      {planData && planData.nickname === 'free' ? <>
        <Modal
          title={false}
          visible={isModalOpenOrder}
          footer={null}
          onCancel={handleCancel}>
          <Row>
            <div className="orderStyle">
              <div className="tdName">
                <Typography>Current Subscription</Typography>
              </div>
              <div className="tdName">
                <Button
                  className="button-right"
                  onClick={() => handleUpgrade()}>Upgrade</Button>
              </div>
            </div>

            <Divider />

            <img src={NewLogo} height={30}  alt={'Logo'} /> PolarityDigital (Yearly Subscription)

            <Divider />

            <div className="orderStyle">
              <div className="tdName">
                <Typography>Plan</Typography>
              </div>
              <div className="tdName">
                <Typography>Standard</Typography>
              </div>
            </div>

            <Divider />

            <div className="orderStyle">
              <div className="tdName">
                <Typography>Price</Typography>
              </div>
              <div className="tdName">
                <Typography>{planData && planData.unit_amount}</Typography>
              </div>
            </div>

            <Divider />

            <div className="orderStyle">
              <div className="tdName">
                <Typography>Billing Period</Typography>
              </div>
              <div className="tdName">
                <Typography>---</Typography>
              </div>
            </div>

            <Divider />

            <div className="orderStyle">
              <div className="tdName">
                <Typography>Expiration</Typography>
              </div>
              <div className="tdName">
                <Typography>---</Typography>
              </div>
            </div>

            <Divider />
          </Row>
        </Modal>
      </> : <>
        <Modal
          className="order_modal"
          title={false}
          visible={isModalOpenOrder}
          footer={null}
          onCancel={handleCancel}>
          <Row className="flex_row">
            <Col>
              <p>Order Summary</p>

              <Divider />

              <div className="orderStyle">
                <div className="tdName">
                  <Typography>  <img src={NewLogo} height={30}  alt={'Logo'} /> PolarityDigital Pro Membership (Billed {planData?.recurring?.interval === 'year' ? 'Yearly' : 'Monthly'})</Typography>
                </div>
                <div className="tdName">
                  <Typography>${planData && (planData.unit_amount / 100).toFixed(2)}</Typography>
                </div>
              </div>

              <Divider />

              <div className="orderStyle">
                <div className="tdName">
                  <Typography>SubTotal</Typography>
                </div>
                <div className="tdName">
                  <Typography>${planData && (planData.unit_amount / 100).toFixed(2)}</Typography>
                </div>
              </div>

              <Divider />

              <div>
                <div>
                  <div className="orderStyle">
                    <div className="tdName">
                      <Button
                        className="add-discount"
                        onClick={addDiscount}>{couponName}</Button>
                    </div>

                    {discount && <>
                      <div className="tdName">
                        <Typography>${(discount/100).toFixed(2)} USD off
                          <Dropdown
                            className="daysDrop"
                            overlay={() => scaleMenu()}
                            trigger={["click"]}>
                            <a onClick={(e) => e.preventDefault()}>
                              <Space>
                                <span className="bold-content">
                                 <Button className="close-discount">:</Button>
                                </span>
                              </Space>
                            </a>
                          </Dropdown>
                        </Typography>
                      </div>
                    </>}

                    {visible && <>
                      <div className="tdName">
                        <Button
                          className="close-discount"
                          onClick={closeDiscount}>
                          <CloseOutlined />
                        </Button>
                      </div>
                    </>}
                  </div>

                  {visible && <>
                    <div className="orderStyle coupon">
                      <div className="tdName">
                        <Input
                          className="add-coupon"
                          placeholder="Discount Code"
                          value={getCouponValue}
                          onChange={(e) => { couponValue(e) }} />
                      </div>

                      <div className="tdName">
                        <Button
                          className="apply-coupon"
                          onClick={() => applyCoupon()}>Apply</Button>
                      </div>
                    </div>
                  </>}

                  {validError && <Typography
                    style={{ color: 'red', marginTop: '5px' }}>{couponError}</Typography>
                  }
                </div>
              </div>

              <Divider />

              <div className="orderStyle">
                <div className="tdName">
                  <Typography>Tax</Typography>
                </div>
                <div className="tdName">
                  <Typography>${(taxAmount / 100).toFixed(2)}</Typography>
                </div>
              </div>

              <Divider />

              <div className="orderStyle">
                <div className="tdName">
                  <Typography>Due today</Typography>
                </div>
                <div className="tdName">
                  <Typography>${totalAmount !== 0 ? (totalAmount / 100).toFixed(2) : planData && (planData.unit_amount / 100).toFixed(2)}</Typography>
                </div>
              </div>

              <Divider />

              <div className="orderStyle">
                <div className="tdName">
                  <Typography>Recurring total {planData?.recurring?.interval === 'year' ? '( Yearly )' : ' (Monthly )'}</Typography>
                </div>
                <div className="tdName">
                  <Typography>${totalAmount !== 0 ? (totalAmount / 100).toFixed(2) : planData && (planData.unit_amount / 100).toFixed(2)}</Typography>
                </div>
              </div>

              <Divider />

              <div className="amount_due mob_only">
                <h2>Due Today <b>${totalAmount !== 0 ? (totalAmount / 100).toFixed(2) : planData && (planData.unit_amount / 100).toFixed(2)}</b></h2>
              </div>
            </Col>

            <Col>
              <Typography>Your Details</Typography>
              <Typography className="form_text">We collect this information to help combat fraud, and to keep your payment secure.</Typography>

              <PaymentFormWrapper
                setIsModalOpenOrder={setIsModalOpenOrder}
                priceId={priceId}
                setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
                planData={planData}
                setTaxAmount={setTaxAmount}
                setTotalAmount={setTotalAmount}
                getCouponValue={couponCode}
                couponObject={couponObject} />
            </Col>
          </Row>

          <Row className="flex_footer">
            <Col>
              <div className="amount_due desk_only">
                <h2>Due Today <b>${totalAmount !== 0 ? (totalAmount / 100).toFixed(2) : planData && (planData.unit_amount / 100).toFixed(2)}</b></h2>
              </div>
            </Col>
          </Row>
        </Modal>
      </>}
    </div>
  )
}

export default OrderDetails
