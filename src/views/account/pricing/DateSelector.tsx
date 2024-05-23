// @ts-ignore
import { Button, Modal, Typography } from "antd";

import NewLogo from '../../../images/logo.png';
import './DateSelector.css';

import OrderDetails from "../subscription/OrderDetails";

export const DateSelector = ({
  isModalOpenYearPlan,
  setIsModalOpenYearPlan,
  setIsModalOpen,
  isModalOpen,
  isModalOpenOrder,
  setIsModalOpenOrder,
  priceId,
  setPriceId,
  currentPlan,
  setCurrentPlanOfCustomer,
  plans
}: any) => {
  const handleCancel = async () => {
    setIsModalOpenYearPlan(false);
  }

  const handleMonYearPlan = (plan: any, currentSelectedPlan:any) => {
    setIsModalOpenYearPlan(false);
    setPriceId(currentSelectedPlan.id);
    setIsModalOpenOrder(true);
    setCurrentPlanOfCustomer(currentSelectedPlan);
  }

  return (
    <>
      <Modal
        title={false}
        visible={isModalOpenYearPlan}
        footer={null}
        onCancel={handleCancel}>
        <h6 className="polar">
          <img src={NewLogo} height={30}  alt={'Logo'}/> PolarityDigital (Yearly Subscription)
        </h6>
        <div className="monthlyearly">
          <div className="leftA">
            <Button onClick={() => handleMonYearPlan('monthly',plans && plans[1])}>Monthly</Button>
            <h3>${plans && plans[1] && (plans[1].unit_amount / 100).toFixed(2)}/{plans && plans[1] && plans[1].recurring.interval}</h3>
          </div>
          <div className="leftA">
            <Button onClick={() => handleMonYearPlan('yearly',plans && plans[2])}>Yearly</Button>
            <h3>${plans && plans[2] && (plans[2].unit_amount / 100).toFixed(2)}/{plans && plans[2] && plans[2].recurring.interval}</h3>
            <Typography>*Save 20%</Typography>
          </div>
        </div>
      </Modal>

      <OrderDetails
        setIsModalOpen={setIsModalOpen}
        isModalOpenOrder={isModalOpenOrder}
        setIsModalOpenOrder={setIsModalOpenOrder}
        priceId={priceId}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} />
    </>
  );
};
