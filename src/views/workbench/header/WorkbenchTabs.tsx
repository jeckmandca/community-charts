import {Col, Dropdown, Menu, Row, Tabs} from "antd";
import {CloseOutlined, EditOutlined, SwapOutlined} from "@ant-design/icons";

import styles from "../WorkbenchStyles";

import {useCompareArrayProperties} from "../../../hooks/useCompareArrayProperties";
import {formatKeys} from "../../../utils/metricsFormatting";
import {FormulaBar} from "../formulas/FormulaBar";
import {ChartToolbar} from "../chart/ChartToolbar";
import {useEffect, useState} from "react";

export const WorkbenchTabs = ({
  metricData,
  setMetricData,
  activeTab,
  setActiveTab,
  tooltipOnOff,
  showMetric,
  hideMetric,
  currentIndex,
  setChartIsSaved,
  removeMetric,
  renameOrReplaceMetric,
  loadingChart,
  updateTabName
}:any) => {
  const [dropdownVisible, setDropdownVisible] = useState(new Array(metricData.length).fill(false));

  const changeTab = (e: any) => {
    setActiveTab(e);
  };

  const handleTabMenuClick: any = (e: any, tabKey: any) => {
    tabKey = parseInt(tabKey);

    try {
      setDropdownVisible(prevState => prevState.map((item, index) => index === tabKey ? false : item));

      if (e.key === "renameOrReplaceMetric") renameOrReplaceMetric(tabKey);
      if (e.key === "removeMetric") removeMetric(tabKey);
    }
    catch (e) {
      console.log(e);
    }
  };

  const tabMenu = (tabKey: any) => (
    <>
      {loadingChart ? null : <div>
        <Menu
          onClick={(e: any) => handleTabMenuClick(e, tabKey)}
          items={[
            {
              label:
                metricData[tabKey]?.selectedMetric === "Formula" ?
                  "Rename" :
                  "Replace",
              key: "renameOrReplaceMetric",
              icon:
                metricData[tabKey]?.selectedMetric === "Formula" ?
                  (<EditOutlined />) :
                  (<SwapOutlined />)
            },
            {
              label: "Remove",
              key: "removeMetric",
              icon: <CloseOutlined />
            }
          ]}
        />
      </div>}
    </>
  );

  // update dropdown visible array when metricData changes
  useEffect(() => {
    setDropdownVisible(new Array(metricData.length).fill(false));
  }, [metricData.length]);

  useCompareArrayProperties((changedElement:any) => {
    updateTabName(changedElement);
  }, metricData, [
    'selectedMetric',
    'selectedButton',
    'selectedCrypto',
    'formulaName'
  ]);

  return <Tabs
    defaultActiveKey={activeTab}
    activeKey={activeTab}
    onChange={(e) => changeTab(e)}
    className="customTabs"
    destroyInactiveTabPane={true}>
    {metricData.map((item: any, index: any) => {
      return (
        <Tabs.TabPane
          tab={
            <Dropdown.Button
              className="customDropdown"
              icon={item.selectedMetric === "Formula" ? `f${item.f}` : `m${item.m}`}
              overlay={() => tabMenu(index)}
              trigger={["click"]}
              visible={dropdownVisible[index]}
              onVisibleChange={(visible) => setDropdownVisible(prevState => prevState.map((item, idx) => idx === index ? visible : item))}>
              <span style={styles.dotContainer}>
                <div style={{...styles.dot, backgroundColor: item.color}}>
                  <div className="dotChildCircle">Y{item.yAxisIndex}</div>
                </div>
              </span>{" "}
              <span className="tab-style">{item.tabName}</span>
            </Dropdown.Button>
          }
          key={index}>

          {item.formulaClicked === true ? (
            <FormulaBar
              metricData={metricData}
              setMetricData={setMetricData}
              currentIndex={currentIndex}
              setChartIsSaved={setChartIsSaved}
              tooltipOnOff={tooltipOnOff} />
          ) : null}

          <Row
            className="mob_scroll"
            style={{
              borderTop: "1px solid rgb(255 255 255 / 35%)",
              display: "flex",
              whiteSpace: "nowrap",
            }}>
            <Col xs={24} md={24} className="custom-ancor">
              <ChartToolbar
                metricData={metricData}
                item={item}
                index={index}
                setChartIsSaved={setChartIsSaved}
                currentIndex={currentIndex}
                setMetricData={setMetricData}
                showMetric={showMetric}
                hideMetric={hideMetric} />
            </Col>
            <Col span={4}></Col>
          </Row>
        </Tabs.TabPane>
      );
    })}
  </Tabs>
}