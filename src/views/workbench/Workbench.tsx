import {Button, Dropdown, Menu, Switch} from "antd";
import {PlusOutlined, DollarOutlined, BarChartOutlined, PlusSquareOutlined} from "@ant-design/icons";

import { useEffect, useRef, useState } from "react";
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import indicatorsAll from "highcharts/indicators/indicators-all";
import annotationsAdvanced from "highcharts/modules/annotations-advanced";
import priceIndicator from "highcharts/modules/price-indicator";
import fullScreen from "highcharts/modules/full-screen";
import stockTools from "highcharts/modules/stock-tools";
import boost from "highcharts/modules/boost";

import "../../styles.css";
import styles from "./WorkbenchStyles";

import {getRandomColor, getUniqueID} from "../../utils/misc";
import {useCompareArrayProperties} from "../../hooks/useCompareArrayProperties";
import {getEconomicData, getHistoricalDataForMetric} from "../../services/MetricService";

import {WorkbenchTabs} from "./header/WorkbenchTabs";
import { WorkbenchHeader } from "./header/WorkbenchHeader";
import chartZoom from "./chart/ChartZoom";
import {ChartConfig} from "./chart/ChartConfig";
import {parseFormulaText} from "./formulas/FormulaTextParsing";

import AddMetric from "./metrics/AddMetric";
import './metrics/AddMetric.css';
import {formatKeys, formatTooltipValues} from "../../utils/metricsFormatting";

indicatorsAll(Highcharts);
annotationsAdvanced(Highcharts);
priceIndicator(Highcharts);
fullScreen(Highcharts);
stockTools(Highcharts);
boost(Highcharts);

chartZoom();

interface WorkbenchProps {
  coinData: any;
  currentPlanOfCustomer: any,
  setCurrentPlanOfCustomer: any,
  customerData: any,
  getSubDetailOfCustomer: any,
  subStatus: any,
  metrics: any,
  metricsNameMap: any,
  metricsKeyMap: any,
  seriesIDMap: any,
  series: any,
  coinSymbolsMap: any
}

export const Workbench = (chartProps: WorkbenchProps) => {
  const chart = useRef<any>();
  const {user, loginWithRedirect} = useAuth0();

  const [formState, setFormState] = useState<"unchanged" | "modified">("unchanged");

  let location = useLocation();

  let providedCoinData = location.state?.coinData;
  if (providedCoinData) providedCoinData = JSON.parse(JSON.stringify(providedCoinData));
  let btcCoinData = chartProps.coinData?.find((item: any) => item.symbol === "btc");
  let firstCoinData = btcCoinData || null;
  if (firstCoinData) firstCoinData = JSON.parse(JSON.stringify(firstCoinData));
  let initialCoinData = providedCoinData || firstCoinData;

  const [selectedCrypto, setSelectedCrypto] = useState(initialCoinData);

  let providedMetric = location.state?.metric;
  if (providedMetric) providedMetric = providedMetric.split("").join("");
  const [selectedMetric, setSelectedMetric] = useState("price");
  const [selectedButton, setSelectedButton] = useState("cryptocurrency");

  const [showIntro, setShowIntro] = useState<any>(false);
  const [currentChartId, setCurrentChartId] = useState(0);
  const [chartName, setChartName] = useState("BTC:Price");
  const [chartIsSaved, setChartIsSaved] = useState(false);
  let [loadingChart, setLoadingChart] = useState(false);
  const [loadingMetric, setLoadingMetric] = useState(false);
  const [loadedMetrics, setLoadedMetrics] = useState<any>({});
  const [loadedChartStartTime, setLoadedChartStartTime] = useState<any>(null);
  let [loadedChartEndTime, setLoadedChartEndTime] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<any>("0");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tooltipOnOff, setTooltipOnOff] = useState(true);
  const [metricModalOpen, setMetricModalOpen] = useState<boolean>(false);
  const [modalOperation, setModalOperation] = useState<any>("");
  const [popupError, setPopupError] = useState<any>(false);

  const chartColors = {
    0: "#FFFFFF",
    1: "#08CA94",
    2: "#C3670F",
    3: "#0879CA"
  };

  // default metric data object
  const getDefaultMetricData = (crypto:any, metric: any, button: any) => {
    // calculate m and f
    let m = metric !== "Formula" ? 1 : 0;
    let f = metric === "Formula" ? 1 : 0;

    if (metric !== "Formula") {
      try {
        let otherMetrics = metricData.filter((item: any) => item.selectedMetric !== "Formula");
        let otherMs = otherMetrics.map((item: any) => item.m);
        if (otherMs.length) m = Math.max(...otherMs) + 1;
      } catch(e) {}
    }

    if (metric === "Formula") {
      try {
        let otherFormulas = metricData.filter((item: any) => item.selectedMetric === "Formula");
        let otherFs = otherFormulas.map((item: any) => item.f);
        if (otherFs.length) f = Math.max(...otherFs) + 1;
      } catch(e) {}
    }

    // get color
    let color = getRandomColor();
    if (metric !== "Formula" && chartColors[m - 1]) color = chartColors[m - 1];
    if (metric === "Formula" && f === 1) color = "#CA0845";

    // determine scale
    let scale = "Linear";
    if (["price", "mdccv", "tcicv", "total_volume", "market_cap"].includes(metric)) {
      scale = "Log";
    }

    let id = getUniqueID();
    return JSON.parse(JSON.stringify({
      id: id,
      m: m,
      f: f,
      formulaName: metric === "Formula" ? `Formula${f}` : "",
      selectedCrypto: crypto,
      selectedMetric: metric,
      selectedButton: button,
      resolution: "1D",
      customFormula: {
        name: "SMA",
        days: 0
      },
      formulaInput: '',
      scale: scale,
      color: color,
      yAxis: "axis-" + id,
      chartStyle: "Line",
      visibility: true,
      zoom: "ALL",
      data: null,
      formulaClicked: metric === "Formula"
    }));
  }

  // default axis config object
  const getDefaultAxisConfig = (metricItem: any) => {
    let axisObject = JSON.parse(JSON.stringify({
      id: "axis-" + metricItem.id,
      labels: {
        align: 'right',
        x: -26,
        enabled: true,
        style: {
          color: "white"
        }
      },
      crosshair: {
        enabled: true,
        snap: false,
        width: "0.03rem",
        color: "#555"
      },
      startOnTick: false,
      endOnTick: false,
      tickPixelInterval: 80,
      showLastLabel: true,
      className: "yaxis-right-grid",
      type: metricItem.scale === "Log" ? "logarithmic" : "linear",
      opposite: false,
      gridLineColor: "rgba(164,164,164,.35)",
      showEmpty: false,
      lineWidth: 1.5,
      lineColor: metricItem.color,
      visible: metricItem.visibility !== undefined ? metricItem.visibility : true
    }));

    axisObject.labels.formatter = function() {
      return formatTooltipValues({}, 'label', this.value);
    };

    return axisObject;
  }

  // prepare initial metrics
  let providedMetricData = location.state?.metricData;
  if (providedMetricData) providedMetricData = JSON.parse(JSON.stringify(providedMetricData));
  let firstMetric = getDefaultMetricData(selectedCrypto, selectedMetric, "cryptocurrency");
  let firstMetricData = [firstMetric];

  // add dashboard metrics
  if (!providedMetricData && providedCoinData && providedMetric) {
    let newMetricData = getDefaultMetricData(providedCoinData, providedMetric, "cryptocurrency");
    newMetricData.m = 2;
    newMetricData.color = chartColors[1];
    firstMetricData.push(newMetricData);
  }

  // set initial metric data
  let initialMetricData = providedMetricData || firstMetricData;
  const [metricData, setMetricData] = useState(initialMetricData);

  // prepare initial chart options
  let initialChartOptions = ChartConfig(
    chartProps,
    handleMetricVisibilityChange
  );

  // set initial chart options
  const [chartOptions, setChartOptions] = useState<any>(initialChartOptions);
  chartOptions.metricDataItems = metricData;

  // define chart data
  const chartData = {
    chartId: 0,
    chartName: chartName,
    userId: user && user.sub,
    metricData: [metricData[0]],
    options: chartOptions
  };

  // forget previous state
  window.history.replaceState({ chartData: null }, '');
  window.history.replaceState({ metric: null }, '');
  window.history.replaceState({ metricData: null }, '');

  useEffect(() => {
    if (chartIsSaved) setFormState("unchanged");
    else setFormState("modified");
  }, [chartIsSaved]);

  // trigger unsaved changes warning
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    if (formState !== "unchanged") {
      window.addEventListener("beforeunload", handler);
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    }

    return () => {};
  }, [formState]);

  // show intro if no metrics are present
  useEffect(() => {
    if (metricData.length === 0) setShowIntro(true);
    else setShowIntro(false);
  }, [metricData.length]);

  // update current index when active tab changes
  useEffect(() => {
    setCurrentIndex(parseInt(activeTab));
  }, [activeTab]);

  // measure chart loading time
  useEffect(() => {
    if (loadingChart) {
      setLoadedChartStartTime(new Date().getTime());
    }
    else {
      if (loadedChartStartTime) {
        loadedChartEndTime = new Date().getTime();
        setLoadedChartEndTime(loadedChartEndTime);
        let loadingTime = loadedChartEndTime - loadedChartStartTime;
        // console.log('Chart loaded in', loadingTime, 'ms');
      }
    }
  }, [loadingChart]);

  // refresh metric data when metric source changes
  useCompareArrayProperties((changedElement:any) => {
    let metricItem = getMetricByID(changedElement.id);
    if (!metricItem) return;
    let metricIndex = metricData.indexOf(metricItem);

    if (changedElement.selectedMetric !== "Formula" ||
      changedElement.refreshFormula === true ||
      loadedMetrics[metricIndex] === false) {
      refreshMetricData(changedElement);
    }
  }, metricData, [
    'selectedButton',
    'selectedCrypto',
    'selectedMetric',
    'refreshFormula',
    'customFormula'
  ]);

  // refresh metrics axes when metrics change
  useEffect(() => {
    metricData.forEach((metricItem:any) => {
      refreshMetricAxis(metricItem);
    });
  }, [metricData]);

  // refresh metrics series when axes change
  useEffect(() => {
    metricData.forEach((metricItem:any) => {
      refreshMetricSeries(metricItem);
    });
  }, [metricData]);

  // copy metric data to window object
  useEffect(() => {
    window['metricData'] = metricData;

    // Create a map of metric IDs to their indices in metricData
    const metricIndices = new Map();
    const metricItems = new Map();
    metricData.forEach((metric: any, index: number) => {
      metricIndices.set(metric.id, index);
      metricItems.set(metric.id, metric);
    });

    window['metricIndices'] = metricIndices;
    window['metricItems'] = metricItems;
  }, [metricData]);

  // turn tooltip on/off
  const handleTooltipOnOff = (e: any) => {
    setTooltipOnOff(e)
  }

  // define add menu
  const addMenu = () => (
    <Menu
      className="add-menu"
      onClick={(e: any) => handleAddMenuClick(e)}
      items={[
        {
          key: "metric",
          label: "Metric",
          icon: <BarChartOutlined />
        },
        {
          key: "formula",
          label: "Formula",
          icon: <PlusSquareOutlined />
        },
        {
          key: "price",
          label: "Price",
          icon: <DollarOutlined />
        }
      ]}
    />
  );

  // handle add menu click
  const handleAddMenuClick = (e: any) => {
    if (e.key === "metric") {
      addMetric();
    }

    if (e.key === "formula") {
      setChartIsSaved(false);

      let newMetricData = getDefaultMetricData(
        selectedCrypto,
        "Formula",
        "cryptocurrency"
      );

      setMetricData([...metricData, newMetricData]);
      setActiveTab(metricData.length.toString());
    }

    if (e.key === "price") {
      setChartIsSaved(false);

      let newMetricData = getDefaultMetricData(
        firstCoinData || null,
        "price",
        "cryptocurrency"
      );
      setMetricData([...metricData, newMetricData]);
      setActiveTab(metricData.length.toString());
    }
  };

  // open modal to add metric
  const addMetric = () => {
    let cryptoMetrics = metricData.filter((item: any) => item.selectedButton === "cryptocurrency");
    let latestCryptoMetric = cryptoMetrics[cryptoMetrics.length - 1];
    let selectedCrypto = latestCryptoMetric?.selectedCrypto || null;
    setSelectedCrypto(selectedCrypto);
    setSelectedMetric(null);
    setSelectedButton("cryptocurrency");
    setModalOperation("Add Metric");
    setMetricModalOpen(true);
  };

  // open modal to rename or replace metric
  const renameOrReplaceMetric = (tabKey: any) => {
    tabKey = Number(tabKey);
    setActiveTab(tabKey.toString());

    if (metricData[tabKey].selectedMetric === "Formula") {
      setModalOperation("Rename Formula");
    }
    else {
      setSelectedCrypto(metricData[tabKey].selectedCrypto);
      setSelectedMetric(metricData[tabKey].selectedMetric);
      setSelectedButton(metricData[tabKey].selectedButton);
      setModalOperation("Replace Metric");
    }

    setMetricModalOpen(true);
  };

  // close modal
  const handleCancel = (e: any) => {
    setMetricModalOpen(false);
  };

  // handle metric modal operation
  const handleMetricModalOperation = (
    operation: any,
    selectedMetric: any,
    selectedCrypto: any,
    formName: any,
    selectedButton: any
  ) => {
    if (operation === "Add Metric") {
      if (isMetricFormValid(selectedMetric, selectedCrypto, selectedButton)) {
        let newMetricData = getDefaultMetricData(
          selectedCrypto,
          selectedMetric,
          selectedButton
        );

        setMetricData([...metricData, newMetricData]);
        setActiveTab(metricData.length.toString());
        setLoadingMetric(true);

        setMetricModalOpen(false);
        setChartIsSaved(false);
      }
      else {
        setPopupError(true);
      }
    }

    if (operation === "Rename Formula") {
      metricData[currentIndex].formulaName = formName;
      setMetricData([...metricData]);
      setMetricModalOpen(false);
      setChartIsSaved(false);
    }

    if (operation === "Replace Metric") {
      if (isMetricFormValid(selectedMetric, selectedCrypto, selectedButton)) {
        metricData[currentIndex].selectedCrypto = selectedCrypto;
        metricData[currentIndex].selectedMetric = selectedMetric;
        metricData[currentIndex].selectedButton = selectedButton;
        metricData[currentIndex].data = null;
        setMetricData([...metricData]);
        setMetricModalOpen(false);
        setChartIsSaved(false);

        // refresh any formulas that use this metric
        if (metricData[currentIndex].selectedMetric !== "Formula") {
          let formulas = metricData
            .filter((item: any) => item.selectedMetric === "Formula");
          formulas.forEach((formula: any) => {
            let metricCode = "m" + metricData[currentIndex].m;
            if (formula.formulaInput.includes(metricCode)) {
              refreshMetricData(formula);
            }
          });
        }
      }
      else {
        setPopupError(true);
      }
    }
  };

  // validate metric form
  const isMetricFormValid = (
    selectedMetric: any,
    selectedCrypto: any,
    selectedButton: any
  ) => {
    if (selectedButton !== "cryptocurrency" &&
      !selectedMetric) return false;
    if (selectedButton === "cryptocurrency" &&
      (!selectedCrypto || !selectedMetric)) return false;

    return true;
  }

  // remove metric
  const removeMetric = (index: any) => {
    index = Number(index);

    let metricID = metricData[index].id;

    // remove axis
    let axisID = "axis-" + metricID;
    let axes = chart.current?.chart?.yAxis;
    if (axes) {
      let axis = axes.find((axis: any) => {
        return axis.options.id === axisID;
      });
      if (axis) axis.remove();
    }

    // remove series
    let series = chart.current?.chart?.series;
    if (series) {
      let seriesItem = series.find((series: any) => {
        return series.options.id === metricID;
      });
      if (seriesItem) seriesItem.remove();
    }

    metricData.splice(index, 1);

    let lastTab = metricData.length - 1;
    if (lastTab < 0) lastTab = 0;
    setActiveTab(lastTab.toString());
    setMetricData([...metricData]);

    setChartIsSaved(false);
  }

  // hide metric
  const hideMetric = (tabId: any) => {
    tabId = Number(tabId);

    let metricData = window['metricData'];
    if (!metricData) return;

    setChartIsSaved(false);

    if (metricData[tabId]) {
      metricData[tabId].visibility = false;
      setMetricData([...metricData]);
    }
  };

  // show metric
  const showMetric = (tabId: any) => {
    tabId = Number(tabId);

    let metricData = window['metricData'];
    if (!metricData) return;

    setChartIsSaved(false);

    if (metricData[tabId]) {
      metricData[tabId].visibility = true;
      setMetricData([...metricData]);
    }
  };

  // toggle metric visibility from chart menu
  function toggleMetricVisibility(metricID: any, eventType: any) {
    let metricData = window['metricData'];
    if (!metricData) return;

    let metricItem = metricData.find((item: any) => item.id === metricID);
    let metricIndex = metricData.indexOf(metricItem);

    if (eventType === "show") showMetric(metricIndex);
    if (eventType === "hide") hideMetric(metricIndex);
  }

  // handle metric visibility change from chart legend
  function handleMetricVisibilityChange(event: any) {
    let targetSeries = event.target;

    let metricID = targetSeries?.userOptions?.id;
    if (metricID === 'highcharts-navigator-series') return;

    let eventType = event.type;
    if (eventType !== "show" && eventType !== "hide") return;

    toggleMetricVisibility(metricID, eventType);
  }

  // function to get metric by ID
  function getMetricByID(metricID: any) {
    return metricData.find((item: any) => item.id === metricID);
  }

  // update metric loaded status
  function updateMetricLoadedStatus(metricID: any) {
    let metricItem = getMetricByID(metricID);
    if (!metricItem) return;

    let metricIndex = metricData.indexOf(metricItem);
    loadedMetrics[metricIndex] = true;
    setLoadedMetrics(loadedMetrics);

    let allMetricsLoaded = Object.values(loadedMetrics).every((item: any) => item === true);
    if (allMetricsLoaded && loadingChart) {
      setLoadingChart(false);

      setTimeout(() => {
        refreshAllSeriesAndAxes();
      }, 100);
    }
    if (allMetricsLoaded && loadingMetric) {
      setLoadingMetric(false);
    }
  }

  // retrieve/refresh metric data based on metric type
  function refreshMetricData(metricItem: any) {
    if (!metricItem) return;
    let metricIndex = metricData.indexOf(metricItem);

    if (!metricItem.id) {
      metricItem.id = getUniqueID();
      metricData[metricIndex].id = metricItem.id;
      setMetricData([...metricData]);
    }

    // get economic data
    if (metricItem.selectedButton === 'economic' ||
      metricItem.selectedButton === 'indexes') {
      new Promise(async resolve => {
        let data = await getEconomicData(metricItem);
        if (!data) data = [];

        updateMetricData(metricItem.id, data);
        updateMetricLoadedStatus(metricItem.id);

        resolve(true);
      });
    }

    // get data for any metrics
    else if (metricItem.selectedMetric !== 'Formula') {
      new Promise(async resolve => {
        let data = await getHistoricalDataForMetric(metricItem);
        if (!data) data = [];

        updateMetricData(metricItem.id, data);
        updateMetricLoadedStatus(metricItem.id);

        resolve(true);
      });
    }

    // process formula
    else if (metricItem.selectedMetric === 'Formula') {
      if (metricItem.formulaInput?.length) {
        new Promise(async resolve => {
          let res = await parseFormulaText(metricData, metricItem);
          metricItem.hasError = res === "error";
          if (!res || res === "error") res = [];

          metricItem.refreshFormula = false;
          updateMetricData(metricItem.id, res);
          updateMetricLoadedStatus(metricItem.id);

          resolve(true);
        });
      }
      else {
        metricItem.data = [];
        setMetricData([...metricData]);
        updateMetricLoadedStatus(metricItem.id);
      }
    }

    else {
      updateMetricLoadedStatus(metricItem.id);
    }

    setMetricData([...metricData]);
  }

  // update metric data by metric ID
  function updateMetricData(metricID: any, data: any) {
    let metricItem = getMetricByID(metricID);
    if (!metricItem) return;

    let currentMetricData = window['metricData'];
    let metricIndex = currentMetricData.indexOf(metricItem);
    currentMetricData[metricIndex].data = data;
    setMetricData([...currentMetricData]);
  }

  // refresh all series and axes
  function refreshAllSeriesAndAxes() {
    metricData.forEach((metricItem:any) => {
      refreshMetricAxis(metricItem);
      refreshMetricSeries(metricItem);
    });
  }

  // refresh metric series when metric parameters change
  function refreshMetricSeries(metricItem: any) {
    if (!metricItem || !metricItem.id) return;
    if (metricItem.selectedMetric === "Formula" && !metricItem.formulaInput) return;
    let metricIndex = metricData.indexOf(metricItem);

    let allSeries = chart.current?.chart?.series;
    let allAxes = chart.current?.chart?.yAxis;
    if (!allSeries || !allAxes) {
      setTimeout(() => {
        refreshMetricSeries(metricItem);
      }, 100);
      return;
    }

    let currentSeries = allSeries.find((series: any) => {
      return series.options.id === metricItem.id;
    });

    let newSeriesData = {
      id: metricItem.id,
      color: metricItem.color,
      data: metricItem.data,
      type: metricItem.chartStyle === "Bar" ? "column" : "line",
      name: metricItem.tabName,
      yAxis: metricItem.yAxis,
      visible: metricItem.visibility,
      findNearestPointBy: "x",
      turboThreshold: 1,
      legendIndex: metricIndex
    };

    if (newSeriesData.data === null) {
      setTimeout(() => {
        refreshMetricSeries(metricItem);
      }, 100);
      return;
    }

    let currentAxis = allAxes.find((axis: any) => {
      return axis.options.id === metricItem.yAxis
    });

    if (!currentAxis) createAxis(metricItem);
    if (!currentAxis) return;

    if (currentSeries) {
      // compare series data and only update if different
      let different = false;
      if (currentSeries.options.color !== newSeriesData.color) {
        // console.log('color', currentSeries.options.color, newSeriesData.color);
        different = true;
      }
      if (currentSeries.options.data !== newSeriesData.data) {
        // console.log('data', currentSeries.options.data, newSeriesData.data);
        different = true;
      }
      if (currentSeries.options.type !== newSeriesData.type) {
        // console.log('type', currentSeries.options.type, newSeriesData.type);
        different = true;
      }
      if (currentSeries.options.name !== newSeriesData.name) {
        // console.log('name', currentSeries.options.name, newSeriesData.name);
        different = true;
      }
      if (currentSeries.options.yAxis !== newSeriesData.yAxis) {
        // console.log('yAxis', currentSeries.options.yAxis, newSeriesData.yAxis);
        different = true;
      }
      if (currentSeries.options.visible !== newSeriesData.visible) {
        // console.log('visible', currentSeries.options.visible, newSeriesData.visible);
        different = true;
      }

      if (!different) return;
      // console.log('Updating series', currentSeries, newSeriesData);
      currentSeries.update(newSeriesData);
    }
    else {
      newSeriesData.visible = true;
      // console.log('Adding new series', newSeriesData);
      let renderableMetrics = metricData.filter((item: any) => item.selectedMetric !== "Formula" || item.formulaInput).length;
      let shouldRedraw = allSeries.length === ((renderableMetrics - 1) * 2);
      // console.log("Should redraw", shouldRedraw);
      chart.current.chart.addSeries(newSeriesData, shouldRedraw);
    }
  }

  function createAxis(metricItem: any) {
    // console.log("Adding new axis", metricItem, metricItem.id);
    let allAxes = chart.current?.chart?.yAxis;
    if (!allAxes) return;

    let axisConfig = getDefaultAxisConfig(metricItem);
    axisConfig.id = metricItem.yAxis;

    let axisIndex = allAxes.length;
    processAxisVariables(axisIndex, axisConfig);
    axisConfig.opposite = axisIndex % 2 === 0;

    return chart.current.chart.addAxis(axisConfig);
  }

  function processAxisVariables(axisIndex: any, axisData: any) {
    axisData.opposite = axisIndex % 2 === 0;
    axisData.labels.align = axisData.opposite ? 'left' : 'right';
    axisData.labels.x = axisData.opposite ? 26 : -26;
    axisData.className = "yaxis-right-grid";
    if (axisIndex % 2 === 0) axisData.className = "yaxis-left-grid";
  }

  function refreshMetricAxis(metricItem: any) {
    if (!metricItem || !metricItem.id) return;

    let allAxes = chart.current?.chart?.yAxis;
    if (!allAxes) {
      setTimeout(() => {
        refreshMetricAxis(metricItem);
      }, 100);
      return;
    }

    let currentAxis = allAxes.find((axis: any) => {
      return axis.options.id === metricItem.yAxis;
    });
    if (!currentAxis) currentAxis = createAxis(metricItem);
    if (!currentAxis) return;

    let currentAxisID = metricItem.yAxis.replace("axis-", "");

    let matchingAxis = metricData.findIndex((item: any) => item.id === currentAxisID);
    if (matchingAxis === -1) {
      metricItem.yAxis = "axis-" + metricItem.id;
      setMetricData([...metricData]);
      return;
    }

    let axisIndex = matchingAxis + 1;
    if (metricItem.yAxisIndex !== axisIndex) {
      metricItem.yAxisIndex = axisIndex;
      setMetricData([...metricData]);
    }

    let actualMetricItem = metricData.find((item: any) => item.id === metricItem.yAxis.replace("axis-", ""));
    if (!actualMetricItem) return;

    let newAxisData = getDefaultAxisConfig(actualMetricItem);
    newAxisData.type = metricItem.scale === "Log" ? "logarithmic" : "linear";
    newAxisData.lineColor = actualMetricItem.color;

    let seriesUsingAxis = metricData.filter((item: any) => item.yAxis === metricItem.yAxis);
    let hasVisibleSeries = seriesUsingAxis.filter((item: any) => item.visibility).length > 0;
    newAxisData.visible = hasVisibleSeries;
    newAxisData.lineWidth = hasVisibleSeries ? 1.5 : 0;

    processAxisVariables(axisIndex, newAxisData);

    // check if different
    let different = false;
    if (currentAxis.options.offset !== newAxisData.offset) {
      // console.log('offset', currentAxis.options.offset, newAxisData.offset);
      different = true;
    }
    if (currentAxis.options.type !== newAxisData.type) {
      // console.log('type', currentAxis.options.type, newAxisData.type);
      different = true;
    }
    if (currentAxis.options.lineColor !== newAxisData.lineColor) {
      // console.log('lineColor', currentAxis.options.lineColor, newAxisData.lineColor);
      different = true;
    }
    if (currentAxis.options.opposite !== newAxisData.opposite) {
      // console.log('opposite', currentAxis.options.opposite, newAxisData.opposite);
      different = true;
    }
    if (currentAxis.options.labels?.align !== newAxisData.labels?.align) {
      // console.log('align', currentAxis.options.labels?.align, newAxisData.labels?.align);
      different = true;
    }
    if (currentAxis.options.visible !== newAxisData.visible) {
      // console.log('visible', currentAxis.options.visible, newAxisData.visible);
      different = true;
    }
    if (currentAxis.options.lineWidth !== newAxisData.lineWidth) {
      // console.log('lineWidth', currentAxis.options.lineWidth, newAxisData.lineWidth);
      different = true;
    }
    if (currentAxis.options.className !== newAxisData.className) {
      // console.log('className', currentAxis.options.className, newAxisData.className);
      different = true;
    }

    if (!different) return;

    // console.log('Updating axis', currentAxis, newAxisData);
    currentAxis.update(newAxisData);
  }

  // reset chart
  const createEmptyChart = () => {
    setChartName("BTC:Price");
    loadingChart = true;
    setLoadingChart(true);
    setActiveTab("0");
    setChartIsSaved(false);
    setMetricData([]);
    setCurrentChartId(0);

    let newLoadedMetrics = {0: false};
    loadedMetrics[0] = false;
    Object.keys(loadedMetrics).forEach((key: any) => {
      if (key !== "0") delete loadedMetrics[key];
    });
    setLoadedMetrics(newLoadedMetrics);

    let newMetricData = getDefaultMetricData(
      selectedCrypto,
      "price",
      "cryptocurrency"
    );
    newMetricData.m = 1;
    newMetricData.color = chartColors[0];
    newMetricData.yAxisIndex = 1;
    metricData.splice(1, metricData.length - 1);
    metricData[0] = newMetricData;
    setMetricData([...metricData]);
    refreshMetricData(metricData[0]);
    updateTabName(metricData[0]);

    return [newMetricData];
  }

  // load chart
  const loadChart = (res: any, chartIndex: any) => {
    try {
      setLoadingChart(true);
      setActiveTab("0");
      setChartIsSaved(true);
      setMetricData([]);

      let loadedMetricData = JSON.parse(JSON.stringify(res.metric_tab_data));

      let newLoadedMetrics = {};
      loadedMetricData.forEach((item: any, index: any) => {
        if (!item.id) item.id = getUniqueID();
        if (item.yAxis === undefined || !item.yAxis.toString().includes("axis-")) {
          item.yAxis = "axis-" + item.id;
        }

        if (item.selectedMetric === "Formula") item.m = 0;
        else item.f = 0;

        newLoadedMetrics[index] = false;
      });
      setLoadedMetrics(newLoadedMetrics);

      loadedMetricData.forEach((metricItem: any) => {
        if (metricItem.Visibility !== undefined) {
          metricItem.visibility = metricItem.Visibility;
          delete metricItem.Visibility;
        }
      });

      setMetricData([...loadedMetricData]);

      setCurrentChartId(Number(chartIndex));
    }
    catch(e) {
      console.log(e);
    }
  }

  function updateTabName(changedElement:any) {
    changedElement.tabName = '';

    let metricName = formatKeys(
      chartProps.metricsKeyMap,
      chartProps.seriesIDMap,
      changedElement.selectedMetric
    );

    if (changedElement.selectedButton === "economic" ||
      changedElement.selectedButton === "indexes") {
      changedElement.tabName = metricName;
    }
    else {
      if (changedElement.selectedMetric === "Formula") {
        changedElement.tabName = changedElement.formulaName;
      }

      if (changedElement.selectedMetric !== "Formula") {
        let symbol = changedElement.selectedCrypto?.symbol;
        if (!symbol) symbol = "BTC";

        changedElement.tabName = `${symbol.toUpperCase()}: ${metricName}`;
      }
    }
  }

  function chartLoaded() {
    // console.log("%c Chart loaded", "color: #FF0000");
    //setLoadedChartEndTime(new Date().getTime());
  }

  return (
    <div>
      {showIntro === true ? (
        <div style={styles.NewMetricContainer}>
          <div>
            <p>Add one or more metrics to start visualizing data.</p>
            <Button onClick={addMetric}>
              <PlusOutlined /> Add metric
            </Button>
          </div>

        </div>
      ) : (
        <>
          <div className="ChartBox">
            <WorkbenchHeader
              chartName={chartName}
              setChartName={setChartName}
              chartIsSaved={chartIsSaved}
              setChartIsSaved={setChartIsSaved}
              user={user}
              loginWithRedirect={loginWithRedirect}
              currentChartId={currentChartId}
              setCurrentChartId={setCurrentChartId}
              metricData={metricData}
              chartOptions={chartOptions}
              chartData={chartData}
              createEmptyChart={createEmptyChart}
              loadChart={loadChart} />
          </div>

          <div style={{...styles.chartAndCoinContainer}}>
            <div style={styles.RiskTopBar}>
              <WorkbenchTabs
                metricData={metricData}
                setMetricData={setMetricData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tooltipOnOff={tooltipOnOff}
                showMetric={showMetric}
                hideMetric={hideMetric}
                currentIndex={currentIndex}
                setChartIsSaved={setChartIsSaved}
                removeMetric={removeMetric}
                renameOrReplaceMetric={renameOrReplaceMetric}
                loadingChart={loadingChart}
                updateTabName={updateTabName} />

              <div className="button-add4">
                <p className="button-add5">Tooltips:&nbsp;
                  <Switch defaultChecked onChange={(e) => handleTooltipOnOff(e)} /></p>
              </div>

              {!loadingMetric && !loadingChart && <Dropdown
                overlay={() => addMenu()}
                trigger={["click"]}>
                <Button className="button-add" style={styles.buttonAdd}>
                  <PlusOutlined className="plus-icon" /> Add
                </Button>
              </Dropdown>}
            </div>

            {loadingChart ?
              <div style={styles.loadingChart}>
                <p>Loading chart data...</p>
              </div> :
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                constructorType={"stockChart"}
                ref={chart}
                className="raf"
                callback={chartLoaded()} /> }
          </div>
        </>
      )}
      {metricModalOpen ?
        <AddMetric
          operation={modalOperation}
          setMetricModalOpen={setMetricModalOpen}
          metricModalOpen={metricModalOpen}
          handleOk={handleMetricModalOperation}
          handleCancel={handleCancel}
          chartProps={chartProps}
          metricData={metricData}
          currentIndex={currentIndex}
          popupError={popupError}
          setPopupError={setPopupError}
          currentPlanOfCustomer={chartProps.currentPlanOfCustomer}
          setCurrentPlanOfCustomer={chartProps.setCurrentPlanOfCustomer}
          customerData={chartProps.customerData}
          getSubDetailOfCustomer={chartProps.getSubDetailOfCustomer}
          subStatus={chartProps.subStatus}
          metrics={chartProps.metrics}
          series={chartProps.series}
          selectedCrypto={selectedCrypto}
          setSelectedCrypto={setSelectedCrypto}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton} />
      : null}
    </div>
  );
};
