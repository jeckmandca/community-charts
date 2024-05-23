import {Button, Col, Dropdown, Input, Menu, Radio, Row, Space} from "antd";
import {CaretDownOutlined, EyeInvisibleOutlined, EyeOutlined, LineOutlined} from "@ant-design/icons";

import {useEffect, useRef, useState} from "react";
import { SketchPicker } from "react-color";

import styles from "../WorkbenchStyles";

import {useOutsideClick} from "../../../hooks/useOutsideClick";

const stockTools = {
  1: {src: "https://code.highcharts.com/9.3.3/gfx/stock-icons/segment.svg", description: "Segment", classname: "highcharts-segment"},
  2: {src: "https://code.highcharts.com/9.3.3/gfx/stock-icons/arrow-segment.svg", description: "Arrow Segment", classname: "highcharts-arrow-segment"},
  3: {src: "https://code.highcharts.com/9.3.3/gfx/stock-icons/ray.svg", description: "Ray", classname: "highcharts-arrow-ray"},
  4: {src: "https://code.highcharts.com/9.3.3/gfx/stock-icons/arrow-ray.svg", description: "Arrow Ray", classname: "highcharts-arrow-segment"},
  5: {src: "https://code.highcharts.com/9.3.3/gfx/stock-icons/line.svg", description: "Line", classname: "highcharts-infinity-line"},
  6: {src: "https://code.highcharts.com/9.3.3/gfx/stock-icons/arrow-line.svg", description: "Arrow Line", classname: "highcharts-arrow-segment"},
  7: {src: "https://code.highcharts.com/9.3.3/gfx/stock-icons/horizontal-line.svg", description: "Horizontal Line", classname: "highcharts-horizontal-line"},
  8: {src: "https://code.highcharts.com/9.3.3/gfx/stock-icons/vertical-line.svg", description: "Vertical Line", classname: "highcharts-vertical-line"}
};

export const ChartToolbar = ({
  metricData,
  item,
  index,
  setChartIsSaved,
  currentIndex,
  setMetricData,
  showMetric,
  hideMetric
}:any) => {
  const [colorPicker, setColorPicker] = useState<any>(item.color);
  const [selectedStockTool, setSelectedStockTool] = useState<any>();
  const [isStockToolDropdownOpen, setStockToolDropdownOpen] = useState(false);
  const toggleStockToolsDropdown = () => setStockToolDropdownOpen(!isStockToolDropdownOpen);
  const [metricFormulaPanelVisible, setMetricFormulaPanelVisible] = useState<boolean>(false);
  const [metricFormulaType, setMetricFormulaType] = useState("SMA");
  const [metricFormulaPeriod, setMetricFormulaPeriod] = useState<any>("");
  const [customAxisOptions, setCustomAxisOptions] = useState<any>(
    {label: "Y1", key: "1"}
  );

  useEffect(() => {
    if (metricData.length > 0) {
      let customAxis = [];
      for (let i = 0; i < metricData.length; i++) {
        customAxis.push({label: `Y${i + 1}`, key: `${i + 1}`});
      }
      setCustomAxisOptions(customAxis);
    }
  }, [metricData.length]);

  const visibilityDrop = <></>;

const colorDrop = () => (
  <>
    <SketchPicker
      color={colorPicker}
      onChangeComplete={(color) => handleColorChange(color)}
    />
  </>
);

  const axisDrop = () => (
    <div>
      <Menu className="borderRightNone"
            onClick={(e: any) => handleAxisMenuClick(e)}
            items={customAxisOptions} />
    </div>
  );

  let chartStyleOptions = ["Line", "Bar"].map((item) => {
    return {label: item, key: item.toLowerCase()};
  });

  const chartStyleMenu = () => (
    <div>
      <Menu className="borderRightNone"
            onClick={(e: any) => handleChartStyleClick(e)}
            items={chartStyleOptions}
      />
    </div>
  );

  let scaleOptions = ["Linear", "Log"].map((item) => {
    return {label: item, key: item.toLowerCase()};
  });

  const scaleMenu = () => (
    <div>
      <Menu
        className="scale-menu"
        onClick={(e: any) => handleScaleClick(e)}
        items={scaleOptions}
      />
    </div>
  );

  const metricFormulaContainer = useRef(null);
  useOutsideClick(metricFormulaContainer, [metricFormulaContainer], () => {
    setMetricFormulaPanelVisible(false);
  });

  let metricFormulaNames = ["SMA", "EMA", "MM"].map((item) => {
    return {label: item, value: item};
  });

  let metricFormulaPeriodOptions = [0, 7, 14, 30, 50, 90].map((item) => {
    return {label: item + " Day", key: item};
  });

  const handleMetricFormulaPanelVisibility = () => {
    setMetricFormulaPanelVisible(true);
  };

  const metricFormulaPanel = () => (
    <div className="MenuOptionsCss" ref={metricFormulaContainer}>
      <Radio.Group
        options={metricFormulaNames}
        optionType="button"
        onChange={(e: any) => selectMetricFormulaType(e)} />
      <Menu
        className="borderRightNone"
        onClick={(e) => applyMetricFormulaPeriod(e)}
        items={metricFormulaPeriodOptions} />
      <Row>
        <Col span={16}>
          <Input
            addonAfter="Days"
            placeholder="100"
            onChange={(e) => updateMetricFormulaPeriod(e)}
            onClick={(e) => e.stopPropagation()} />
        </Col>
        <Col span={8}>
          <Button onClick={() => applyMetricFormula()}>Apply</Button>
        </Col>
      </Row>
    </div>
  );

  const selectMetricFormulaType = (e: any) => {
    setMetricFormulaType(e.target.value);
    setMetricFormulaPanelVisible(true);
  };

  const updateMetricFormulaPeriod = (e: any) => {
    setMetricFormulaPeriod(e.target.value);
  };

  const applyMetricFormulaPeriod = (e: any) => {
    setChartIsSaved(false);
    setMetricFormulaPanelVisible(false);

    if (e.key >= 0) {
      metricData[currentIndex].customFormula =
        {name: metricFormulaType, days: Number(e.key)};
      setMetricData([...metricData]);
    }
  };

  const applyMetricFormula = () => {
    if (metricFormulaPeriod) {
      setMetricFormulaPanelVisible(false);
      metricData[currentIndex].customFormula =
        {name: metricFormulaType, days: Number(metricFormulaPeriod)};
      setMetricData([...metricData]);
    }
  };

  const handleStockToolClick = (id: any) => {
    setStockToolDropdownOpen(!isStockToolDropdownOpen);
    setSelectedStockTool(id);
  };

  const handleAxisMenuClick = (e: any) => {
    e.key = Number(e.key);
    setChartIsSaved(false);

    let yAxisIndex = e.key - 1;
    let metricItem = metricData[yAxisIndex];
    if (!metricItem) return;

    metricData[currentIndex].yAxis = "axis-" + metricItem.id;
    metricData[currentIndex].yAxisIndex = e.key;
    metricData[currentIndex].scale = metricItem.scale;

    setMetricData([...metricData]);
  };

  const handleScaleClick = (e: any) => {
    // get axis of current metric
    let yAxisIndex = metricData[currentIndex].yAxisIndex;
    if (!yAxisIndex) return;

    // get all metrics with the same axis
    let metrics = metricData.filter((item:any) => item.yAxisIndex === yAxisIndex);

    // set scale for all metrics with the same axis
    metrics.forEach((item:any) => {
      if (e.key === "linear") item.scale = "Linear";
      if (e.key === "log") item.scale = "Log";
    });

    setMetricData([...metricData]);
    setChartIsSaved(false);
  };

  const handleChartStyleClick = (e: any) => {
    setChartIsSaved(false);

    if (e.key === "line") metricData[currentIndex].chartStyle = "Line";
    if (e.key === "bar") metricData[currentIndex].chartStyle = "Bar";

    setMetricData([...metricData]);
  };

const handleColorChange = (color) => {
  const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
  setChartIsSaved(false);
  setColorPicker(rgbaColor); // Update the state with the RGBA color string
  metricData[currentIndex].color = rgbaColor; // Apply the RGBA color to the current metric
  setMetricData([...metricData]); // Refresh the metric data array to reflect changes
};


  return <>
    {item.formulaClicked === false && (
      <>
        <Dropdown
          className="daysDrop"
          overlay={() => metricFormulaPanel()}
          visible={metricFormulaPanelVisible}
          onVisibleChange={() => { handleMetricFormulaPanelVisibility() }}
          trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <span className="res-color">{`${item.customFormula.name}`}</span>
              <span className="bold-content">{`${item.customFormula.days} Days`}</span>
              <CaretDownOutlined />
            </Space>
          </a>
        </Dropdown>
      </>
    )}

    <Dropdown
      className="daysDrop"
      overlay={() => scaleMenu()}
      trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <span className="res-color">Scale</span>
          <span className="bold-content">{item.scale}</span>
          <CaretDownOutlined />
        </Space>
      </a>
    </Dropdown>

    <Dropdown
      className="daysDrop"
      overlay={() => colorDrop()}
      trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <span className="res-color">Color</span>
          <span style={styles.dotContainer}>
            <div style={{...styles.menuDot, backgroundColor: item.color}}></div>
          </span>
          <CaretDownOutlined />
        </Space>
      </a>
    </Dropdown>

    <Dropdown
      className="daysDrop"
      overlay={() => axisDrop()}
      trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <span className="res-color">Y Axis</span>
          <span className="bold-content">Y{item.yAxisIndex}</span>
          <CaretDownOutlined />
        </Space>
      </a>
    </Dropdown>

    <Dropdown
      className="daysDrop"
      overlay={() => chartStyleMenu()}
      trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <span className="res-color">Chart Style</span>
          <span className="bold-content">{item.chartStyle}</span>
          <CaretDownOutlined />
        </Space>
      </a>
    </Dropdown>

    <div className="dropdown stockToolsDropdown daysDrop">
      <div className="dropdown-header" onClick={toggleStockToolsDropdown}>
        <div className="modalHeaderTitle">Stock Tools</div>
        <div className="bottomHeader">
          {selectedStockTool && stockTools[selectedStockTool] ? (
            <img
              src={stockTools[selectedStockTool].src}
              height="22px"
              width="22px"
              className="stockIcons"
              alt={stockTools[selectedStockTool].description} />
          ) : (
            <LineOutlined />
          )}
          <CaretDownOutlined />
        </div>
      </div>

      <div className={`dropdown-body ${isStockToolDropdownOpen && "open"}`}>
        {Object.keys(stockTools).map((key) => (
          <div
            className="dropdown-item"
            onClick={(e) => handleStockToolClick(key)}
            id={key}
            key={key}>
            <img
              src={stockTools[key].src}
              height="22px"
              width="22px"
              className="stockIcons"
              alt={stockTools[key].description} />
            <div className="tools-container">
              <span className={stockTools[key].classname}>
                {stockTools[key].description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <Dropdown
      className="daysDrop"
      overlay={visibilityDrop}>
      <a onClick={() => item.visibility === false
        ? showMetric(index)
        : hideMetric(index)}>
        <Space>
          <span className="res-color">Visibility</span>
          <span className="bold-content">
            {item.visibility === false ? (
              <EyeInvisibleOutlined />
            ) : (
              <EyeOutlined />
            )}
          </span>
        </Space>
      </a>
    </Dropdown>
  </>
}
