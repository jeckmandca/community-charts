import { Select } from "antd";

import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { InlineStylesModel } from "../../../models/InlineStyleModel";

import {getMetricOptions} from "./MetricOptions";
import PricingPopUp from "../../account/pricing/PricingPopUp";
import RenewSubscription from "../../account/subscription/RenewSubscription/RenewSubscription";

const styles: InlineStylesModel = {
  metricSelectorStyle: {
    color: "white",
    fontSize: "14px",
    marginBottom: "0em",
    fontWeight: 400,
    cursor: "pointer",
    width: "100%"
  }
};

export const MetricSelector = ({
  selectedCrypto,
  selectedButton,
  selectedMetric,
  setSelectedMetric,
  setPopupError,
  currentPlanOfCustomer,
  setCurrentPlanOfCustomer,
  customerData,
  setMetricModalOpen,
  getSubDetailOfCustomer,
  subStatus,
  metrics,
  series
}:any) => {
  const {isAuthenticated, loginWithRedirect} = useAuth0();

  const [isModalOpenPrice, setIsModelOpenPrice] = useState(false);
  const [isModelOpenRenewDeclined, setModelOpenRenewDeclined] = useState(false);

  const onMetricSelected = (value: any) => {
    setSelectedMetric(value);
    setPopupError(false);
  };

  const onSearch = () => {}

  const handleUpgrade = () => {
    setMetricModalOpen(false);

    if (!isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.pathname
        }
      });
    }
    else {
      if (currentPlanOfCustomer === 'free' &&
        (!subStatus || subStatus === 'canceled')) {
        setIsModelOpenPrice(true);
        setModelOpenRenewDeclined(false);
      }
      else if (currentPlanOfCustomer === 'free' &&
        (subStatus === 'past_due' || subStatus === 'unpaid')) {
        setModelOpenRenewDeclined(true);
        setIsModelOpenPrice(false);
      }
      else {
        setIsModelOpenPrice(true);
      }
    }
  }

  const handleFilter = (input: string, option: any) => {
    let text = option?.children || '';
    return text && text.toLowerCase && text.toLowerCase().includes(input.toLowerCase());
  }

  return (
    <>
      <Select
        onChange={onMetricSelected}
        style={styles.metricSelectorStyle}
        placeholder="Select metric"
        value={selectedMetric}
        size={"small"}
        className="metricDropdown"
        showSearch
        optionFilterProp="children"
        onSearch={onSearch}
        filterOption={handleFilter}>
        {
          getMetricOptions({
            selectedButton,
            selectedCrypto,
            currentPlanOfCustomer,
            metrics: metrics,
            series: series,
            handleUpgrade
          })
        }
      </Select>

      <RenewSubscription
        isModelOpenRenewDeclined={isModelOpenRenewDeclined}
        setModelOpenRenewDeclined={setModelOpenRenewDeclined}
        getSubDetailOfCustomer={getSubDetailOfCustomer}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        currentPlanOfCustomer={currentPlanOfCustomer} />

      <PricingPopUp
        isModelOpenPrice={isModalOpenPrice}
        setIsModelOpenPrice={setIsModelOpenPrice}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        currentPlanOfCustomer={currentPlanOfCustomer}
        customerData={customerData} />
    </>
  );
};
