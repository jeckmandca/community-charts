import {
  Select,
  Modal,
  Form,
  Typography,
  Input,
  Button,
  Checkbox,
  Row,
  Col
} from "antd";
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import React, { useEffect, useState } from "react";

import './AddMetric.css';
import styles from '../WorkbenchStyles';

import { MetricSelector } from "./MetricSelector";

const AddMetric = ({
  operation,
  setMetricModalOpen,
  metricModalOpen,
  handleOk,
  handleCancel,
  chartProps,
  metricData,
  currentIndex,
  popupError,
  setPopupError,
  currentPlanOfCustomer,
  setCurrentPlanOfCustomer,
  customerData,
  getSubDetailOfCustomer,
  subStatus,
  metrics,
  series,
  selectedCrypto,
  setSelectedCrypto,
  selectedMetric,
  setSelectedMetric,
  selectedButton,
  setSelectedButton
}: any) => {
  let initialFormulaName = metricData[currentIndex]?.formulaName || '';
  const [formulaName, setFormulaName] = useState(initialFormulaName);
  const [riskCoinsOnly, setRiskCoinsOnly] = useState(false);
  const [cryptoOptions, setCryptoOptions] = useState([]);

  let operationArray = operation.split(' ');
  let okText = operationArray[0];

  // prepare the crypto menu items
  const cryptoMenuItems =
    chartProps.coinData !== null
      ? chartProps.coinData.map((menuOption: any) => {
        return (
          <Select.Option
            key={menuOption.name}
            symbol={menuOption.symbol}
            value={menuOption.coin_id}
            isPro={menuOption.risk_exist}
            style={{
              backgroundColor: "#0a0c12",
              fontSize: 16
            }}>
            <Row style={styles.datePickerTitle} align="middle">
              <Col style={styles.cryptoSelectorCol}>
                <img
                  alt={`${menuOption.name}-logo`}
                  src={menuOption.image}
                  style={{ ...styles.logoStyle, ...{ marginRight: "10px" } }} />
                {menuOption.name} ({menuOption.symbol.toUpperCase()})
              </Col>
            </Row>
          </Select.Option>
        );
      })
      : null;

  // filter the crypto menu items based on the risk coins only checkbox
  useEffect(() => {
    if (riskCoinsOnly)
      setCryptoOptions(cryptoMenuItems.filter((item: any) => item.props.isPro === 1));
    else
      setCryptoOptions([...cryptoMenuItems]);
  }, [riskCoinsOnly]);

  // set the formula name when the modal is opened
  useEffect(() => {
    if (metricData[currentIndex]) setFormulaName(metricData[currentIndex].formulaName);
    else setFormulaName('');
  }, [metricModalOpen]);

  // update button styles when the modal is opened
  useEffect(() => {
    let buttons = {
      "cryptocurrency": "crypto-button",
      "economic": "economic-button",
      "indexes": "indexes-button"
    };
    Object.values(buttons).forEach((button) => {
      let btn = document.querySelector(`.${button}`);
      if (btn) btn.classList.remove("active");
    });

    let classname = buttons[selectedButton];
    let container = document.querySelector(`.${classname}`);
    if (container) container.classList.add("active");
  }, [selectedButton]);

  // update the selected crypto when a new crypto is selected
  const cryptoSelected = (coinID: string) => {
    setPopupError(false);

    const coin = chartProps.coinData.find((coin: any) => coin.coin_id === coinID);
    setSelectedCrypto(coin);
    setSelectedMetric(null);
  };

  // update the formula name when the input is changed
  const handleFormulaNameInput = (e: any) => {
    setFormulaName(e.target.value);
  }

  // handle search
  const onSearch = (value: string) => {}

  // handle the entity buttons
  const handleEntityButton = (value: string) => {
    setPopupError(false);
    setSelectedMetric(null);
    setSelectedCrypto(null);
    setSelectedButton(value);
  }

  // handle the show only risk metrics checkbox
  const handleRiskMetricsCheckbox = (e: CheckboxChangeEvent) => {
    setRiskCoinsOnly(e.target.checked);

    setSelectedCrypto(null);
    setSelectedMetric(null);
  }

  // handle filter coins
  const handleFilterCoins = (input: string, option: any) => {
    return (option?.key || '').toLowerCase().includes(input.toLowerCase()) ||
      (option?.symbol || '').toLowerCase().includes(input.toLowerCase());
  }

  return (
    <div style={styles.ModalContainer}>
      {(operation === 'Rename Formula' ?
        (
          <Modal
            className="metricModal"
            title={operation}
            visible={metricModalOpen}
            okText={okText}
            onOk={(e: any) => handleOk(
              operation,
              selectedMetric,
              selectedCrypto,
              formulaName,
              selectedButton
            )}
            onCancel={handleCancel}>
            <Form className="customForm">
              <Typography className="typoCustomColor">Name</Typography>
              <Input
                placeholder="formula"
                value={formulaName}
                onChange={(e) => { handleFormulaNameInput(e) }} />
            </Form>
          </Modal>
        ) :
        (
          <Modal
            className="metricModal"
            title={operation}
            visible={metricModalOpen}
            okText={okText}
            onOk={(e: any) => handleOk(
              operation,
              selectedMetric,
              selectedCrypto,
              formulaName,
              selectedButton
            )}
            onCancel={handleCancel}>
            <Form className="customForm">
              <div className="metricModalCustomButton">
                <Button
                  className="crypto-button"
                  onClick={() => handleEntityButton("cryptocurrency")
                }>Cryptocurrency</Button>

                <Button
                  className="economic-button"
                  onClick={() => handleEntityButton("economic")
                }>Economic</Button>

                <Button
                  className="indexes-button"
                  onClick={() => handleEntityButton("indexes")
                }>Indexes</Button>
              </div>

              {selectedButton === 'cryptocurrency' && <Checkbox
                style={{ color: "#fff" }}
                onChange={handleRiskMetricsCheckbox}
              >Show only assets with risk metrics?</Checkbox>}

              <Typography className={selectedButton !== 'cryptocurrency' ?
                'disableColor' : "typoCustomColor"}>Assets</Typography>

              <Select
                className="customSelectOne"
                listItemHeight={13}
                style={{cursor: 'pointer', width: "100%", marginBottom: "10px", position: 'relative'}}
                onChange={cryptoSelected}
                value={selectedCrypto !== null ? selectedCrypto.coin_id : null}
                showSearch
                placeholder={selectedButton !== 'cryptocurrency' ? 'N/A' : "Search for a coin"}
                optionFilterProp="children"
                onSearch={onSearch}
                filterOption={handleFilterCoins}
                disabled={selectedButton !== 'cryptocurrency'}>
                {cryptoOptions}
              </Select>

              <Typography className="input-label">Metrics</Typography>

              <MetricSelector
                setMetricModalOpen={setMetricModalOpen}
                metrics={metrics}
                series={series}
                selectedCrypto={selectedButton === 'economic' || selectedButton === 'indexes' ? null : selectedCrypto}
                selectedButton={selectedButton}
                selectedMetric={selectedMetric}
                setSelectedMetric={setSelectedMetric}
                setPopupError={setPopupError}
                currentPlanOfCustomer={currentPlanOfCustomer}
                setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
                customerData={customerData}
                getSubDetailOfCustomer={getSubDetailOfCustomer}
                subStatus={subStatus} />

              {popupError === true ?
                <>
                  <Typography style={{ color: 'red' }}>All fields are required</Typography>
                </> : null
              }
            </Form>
          </Modal>
        )
      )}
    </div>
  )
}

export default AddMetric
