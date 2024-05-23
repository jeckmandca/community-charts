import { Modal, Typography } from "antd";

import { cancelSubscription, savePaidCustomer } from "../../../services/StripeService";

const CancelPopUp = ({
  isModelOpenCancel,
  setIsModelOpenCancel,
  setCurrentPlanOfCustomer,
  subID,
  expireDate,
  user
}: any) => {
  const { success } = Modal;

  const handleCancel = () => {
    setIsModelOpenCancel(false);
  };

  const handleOk = () => {
    let body = {user: user};

    const cancelSub = async () => {
      await cancelSubscription(subID);

      setCurrentPlanOfCustomer("pro");
      setIsModelOpenCancel(false);

      success({
        content: (
          <div>
            You have successfully canceled your subscription.
          </div>
        ),
        async onOk() {
          await savePaidCustomer(body,`Membership expires on ${expireDate}`);
        }
      });
    }

    cancelSub();
  }

  return (
    <div>
      <Modal
        title={'Cancel your subscription?'}
        visible={isModelOpenCancel}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={'Yes'}
        cancelText={'No'}>
        <Typography>Would you like to cancel your subscription?</Typography>
      </Modal>
    </div>
  )
}

export default CancelPopUp
