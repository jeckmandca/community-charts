import { Modal, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";

import './PricingPopUp.css';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { getPlans } from "../../../services/StripeService";
import { DateSelector } from "./DateSelector";

const PricingPopUp = ({
  isModelOpenPrice,
  setIsModelOpenPrice,
  setCurrentPlanOfCustomer,
  currentPlanOfCustomer,
  customerData
}: any) => {
  const [plans, setPlans] = useState([
    {
      id: '',
      unit_amount: 0,
      recurring: {
        interval: ''
      }
    }
  ]);

  const [isModalOpenOrder, setIsModalOpenOrder] = useState(false);
  const [priceId, setPriceId] = useState('');
  const [currentPlan, setCurrentPlan] = useState({});
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenYearPlan, setIsModalOpenYearPlan] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const getStripePlans = async () => {
      let data = await getPlans();
      data = [...data.data].reverse();
      setPlans(data);
    }
    getStripePlans();
  }, []);

  const handleCancel = () => {
    setIsModelOpenPrice(false);
  };

  const handleCurrentPlan = (currentPlan: any) => {
    setCurrentPlanOfCustomer(currentPlan);
    setIsModelOpenPrice(false);

    navigate('/settings', {
      state: {
        currentPlan: currentPlan,
        customerData: customerData,
        activeTab: 'Billing'
      }
    });
  }

  const handlePlans = (val: any, plan: any) => {
    setIsModelOpenPrice(false);
    setIsModalOpen(false);
    setIsModalOpenYearPlan(true);
    setPriceId(val);
    setCurrentPlan(plan);
  }

  return (
    <div>
      <Modal
        className="planModal modal_wide"
        title={"Upgrade your account"}
        visible={isModelOpenPrice}
        footer={null}
        onCancel={handleCancel}>
        <div className="price_colums">
          <ul className="plans_type">
            <li className="plan_title_box">
              <h3>Free Basic Data Access</h3>
              <p>In depth cryptocurrency and market analysis</p>
              <Button
                className="btn_blank"
                onClick={() => !isAuthenticated ? loginWithRedirect({
                  screen_hint: 'signup', appState: {
                    returnTo: window.location.pathname
                  }
                }) : handleCurrentPlan('free')}>{!isAuthenticated ?
                'Sign In/Register' : currentPlanOfCustomer === 'free' ?
                'Current Plan' : 'Basic Plan'}</Button>
            </li>

            <li className="mini_titlr">
              <span>Free Basic Data Access</span>
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Free Basic Data Access
            </li>

            <li className="mini_titlr">
              <span>Market Analysis Tools</span>
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Workbench analysis platform
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Full service crypto price tracking
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              100+ leading economic indicators
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Stock market and index tracking
            </li>

            <li className="mini_titlr">
              <span>In Depth Market Analysis</span>
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Market analysis reports
            </li>
          </ul>

          <ul className="plans_type">
            <li className="plan_title_box">
              <h3>Polarity Digital Pro</h3>
              <p>Institutional analysis for the retail investor</p>
              <Button
                className="btn_fill"
                onClick={() => !isAuthenticated ? loginWithRedirect({
                  screen_hint: 'signup', appState: {
                    returnTo: window.location.pathname
                  }
                }) : currentPlanOfCustomer === 'free' ?
                handlePlans(plans[1] && plans[1].id, plans[1]) :
                handleCurrentPlan('pro')}>{!isAuthenticated ?
                'Get Pro Access' : currentPlanOfCustomer === 'pro' ?
                'Your Current Plan' : 'Get Pro Access'}</Button>
            </li>

            <li className="mini_titlr">
              <span>Plan Pricing</span>
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              ${plans && plans[1] && (plans[1].unit_amount / 100).toFixed(2)}/{plans && plans[1] && plans[1].recurring.interval}
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              ${plans && plans[2] && (plans[2].unit_amount / 100).toFixed(2)}/{plans && plans[2] && plans[2].recurring.interval}
            </li>

            <li className="mini_titlr">
              <span>Market Analysis Tools</span>
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Workbench analysis platform
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Full service crypto price tracking
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              100+ leading economic indicators
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Stock market and index tracking
            </li>

            <li className="mini_titlr">
              <span>Data Driven Market Analytics</span>
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Upside-Downside Potential Indicators
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Trend Confidence Indicators
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Market Direction Classifier Models
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Momentum Bias Indicators
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Probabilistic Forecast Models
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Instant access to all new models & indicators
            </li>

            <li className="mini_titlr">
              <span>Market Analysis Tools</span>
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Member exclusive video reports
            </li>

            <li className="plan_tools">
              <span className="pln_icon"><CheckOutlined /></span>
              Member only discord access
            </li>
          </ul>
        </div>
      </Modal>

      <DateSelector
        setIsModalOpenYearPlan={setIsModalOpenYearPlan}
        isModalOpenYearPlan={isModalOpenYearPlan}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        isModalOpenOrder={isModalOpenOrder}
        setIsModalOpenOrder={setIsModalOpenOrder}
        priceId={priceId}
        setPriceId={setPriceId}
        currentPlan={currentPlan}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        plans={plans} />
    </div>
  )
}

export default PricingPopUp
