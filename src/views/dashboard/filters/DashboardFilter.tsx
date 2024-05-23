import {Modal, Typography, Input, Button, Row, Col,  List } from "antd";

import { useState } from "react";

import './DashboardFilter.css'

import {addNumberSuffixes, extractNumber} from "../../../utils/numberFormatting";
import TooltipWrapper from "../tooltip/Tooltip";

const DashboardFilter = ({
  isModelOpen,
  setIsModelOpen,
  minValue,
  maxValue,
  setValue,
  setLabel,
  type
}: any) => {
  const [minInputVal, setMinInputVal] = useState('');
  const [maxInputVal, setMaxInputVal] = useState('');

  const handleCancel = () => {
    setIsModelOpen(false);
  }

  const setMinMaxInputValue = (minInput: any, maxInput: any) => {
    setMinInputVal(minInput);
    setMaxInputVal(maxInput);
  }

  const handleMinInput = (e: any) => {
    setMinInputVal(e.target.value);
  }

  const handleMaxInput = (e: any) => {
    setMaxInputVal(e.target.value);
  }

  const RemoveFilters = () => {
    setMinInputVal('');
    setMaxInputVal('');
  }

  const handleFilters = () => {
    let value = [];
    let min:any = extractNumber(minInputVal);
    let max:any = extractNumber(maxInputVal);
    let label = type === 'marketCap' ? 'Market Cap: ' : 'Volume: ';

    if (min && max) {
      value = [min, max];
      label = label + `$${addNumberSuffixes(min)}-$${addNumberSuffixes(max)}`;
    }
    else if (min && !max) {
      value = [min, maxValue];
      label = label + `>$${addNumberSuffixes(min)}`;
    }
    else if (!min && max) {
      value = [minValue, max];
      label = label + `<$${addNumberSuffixes(max)}`;
    }
    else {
      label = `Sort: ` + (type === 'marketCap' ? 'Market Cap' : 'Trading Volumes');
    }

    setLabel(label);
    setValue(value);
    setIsModelOpen(false);
  }

  return (
    <div>
      <Modal
        className="volume-mc-model trade_box"
        title={type === 'marketCap' ? "Market Cap" : "Trading Volume"}
        visible={isModelOpen}
        footer={null}
        onCancel={handleCancel}>
        <div className="box-design">
          <Typography
            style={{ marginRight: "7px" }}
            className="trade_title">{
            type === 'marketCap' ?
              "Market Cap Range" :
              "Trading Volume Range"
          }</Typography>

          <TooltipWrapper text={() => (<div className="tooltip-box"><span>You can type the complete numerical value or use abbreviations such as 1M to represent 1 Million etc.
            ‌</span><div style={{ marginTop: "10px" }}> Supported abbreviations include: K, M, B, T</div>
            <div style={{ marginTop: "10px" }}>Example: To search for all values between 175 Million and 1.3 Billion, you could type 175M in the min range box and 1.3B in the max range box.</div></div>)}>
          </TooltipWrapper>
        </div>

        <Row className="tade_range">
          <Col>
            <Input
              placeholder="Min Range"
              value={minInputVal}
              onChange={(e) => handleMinInput(e)} />
          </Col>

          <Col className="col_30">to</Col>

          <Col>
            <Input
              placeholder="Max Range"
              value={maxInputVal}
              onChange={(e) => handleMaxInput(e)} />
          </Col>
        </Row>

        <List className="list_tags">
          <List.Item onClick={() => setMinMaxInputValue('', '$1M')}>{`<$1M`}</List.Item>
          <List.Item onClick={() => setMinMaxInputValue('$1M', '$10M')}>{`$1M-$10M`}</List.Item>
          <List.Item onClick={() => setMinMaxInputValue('$10M', '$100M')}>{`$10M-$100M`}</List.Item>
          <List.Item onClick={() => setMinMaxInputValue('$100M', '$1B')}>{`$100M-$1B`}</List.Item>
          <List.Item onClick={() => setMinMaxInputValue('$1B', '$10B')}>{`$1B-$10B`}</List.Item>
          <List.Item onClick={() => setMinMaxInputValue('$10B', '')}>{`>$10B`}</List.Item>
        </List>

        <Row className="btn_range">
          <Button onClick={() => handleFilters()}>Apply Filters</Button>
          <Button onClick={() => RemoveFilters()}>Reset Filters</Button>
        </Row>
      </Modal>
    </div>
  )
}

export default DashboardFilter
