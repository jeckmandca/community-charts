import { Modal, Typography } from "antd";

import { renewSubscription, savePaidCustomer } from "../../../services/StripeService";

const SuccessPopUp = ({
  isModelOpenRenew,
  setIsModelOpenRenew,
  setCurrentPlanOfCustomer,
  subID,
  expireDate,
  user
}: any) => {
  const { success } = Modal;

  const handleCancel = () => {
    setIsModelOpenRenew(false);
  };

  const handleOk = () => {
    let body = {user: user};

    const renewSub = async () => {
      await renewSubscription(subID);

      setCurrentPlanOfCustomer('pro');
      setIsModelOpenRenew(false);

      success({
        content: (
          <div>
            Your membership is now renewed!
          </div>
        ),
        async onOk(){
          await savePaidCustomer(body,`active`);
        }
      })
    };

    renewSub();
  }

  return (
    <div>
      <Modal
        title={'Renew Subscription'}
        visible={isModelOpenRenew}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={'Yes renew it'}
        cancelText={'No'}>
        <Typography> Billing will begin at the end of your current subscription's expiration date, {expireDate}! Would you like to renew your membership?</Typography>
      </Modal>
    </div>
  )
}

export default SuccessPopUp
