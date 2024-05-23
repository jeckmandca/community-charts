import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Dropdown, Menu, Switch } from 'antd';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import indicatorsAll from 'highcharts/indicators/indicators-all';
import annotationsAdvanced from 'highcharts/modules/annotations-advanced';
import priceIndicator from 'highcharts/modules/price-indicator';
import fullScreen from 'highcharts/modules/full-screen';
import stockTools from 'highcharts/modules/stock-tools';
import boost from 'highcharts/modules/boost';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import 'antd/dist/antd.css';
import '../../../styles.css'; // Adjusted path
import styles from '../WorkbenchStyles'; // Adjusted path

import { getRandomColor, getUniqueID } from '../../../utils/misc'; // Adjusted path
import { useCompareArrayProperties } from '../../../hooks/useCompareArrayProperties'; // Adjusted path
import { getEconomicData, getHistoricalDataForMetric } from '../../../services/MetricService'; // Adjusted path
import { WorkbenchTabs } from '../header/WorkbenchTabs'; // Adjusted path
import { WorkbenchHeader } from '../header/WorkbenchHeader'; // Adjusted path
import chartZoom from '../chart/ChartZoom'; // Adjusted path
import { ChartConfig } from '../chart/ChartConfig'; // Adjusted path
import { parseFormulaText } from '../formulas/FormulaTextParsing'; // Adjusted path
import AddMetric from '../metrics/AddMetric'; // Adjusted path
import '../metrics/AddMetric.css'; // Adjusted path
import { formatKeys, formatTooltipValues } from '../../../utils/metricsFormatting'; // Adjusted path

indicatorsAll(Highcharts);
annotationsAdvanced(Highcharts);
priceIndicator(Highcharts);
fullScreen(Highcharts);
stockTools(Highcharts);
boost(Highcharts);

chartZoom();

const FullScreenChartModal = ({ chartProps }) => {
  const [visible, setVisible] = useState(false);
  const chartRef = useRef(null);
  const chart = chartRef; // Assign chartRef to chart to avoid undefined errors

  const showModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  let location = useLocation();
  const { user, loginWithRedirect } = useAuth0();
  const [formState, setFormState] = useState<"unchanged" | "modified">("unchanged");
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

  const getDefaultMetricData = (crypto:any, metric: any, button: any) => {
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

    let color = getRandomColor();
    if (metric !== "Formula" && chartColors[m - 1]) color = chartColors[m - 1];
    if (metric === "Formula" && f === 1) color = "#CA0845";

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

  let providedMetricData = location.state?.metricData;
  if (providedMetricData) providedMetricData = JSON.parse(JSON.stringify(providedMetricData));
  let firstMetric = getDefaultMetricData(selectedCrypto, selectedMetric, "cryptocurrency");
  let firstMetricData = [firstMetric];

  if (!providedMetricData && providedCoinData && providedMetric) {
    let newMetricData = getDefaultMetricData(providedCoinData, providedMetric, "cryptocurrency");
    newMetricData.m = 2;
    newMetricData.color = chartColors[1];
    firstMetricData.push(newMetricData);
  }

  let initialMetricData = providedMetricData || firstMetricData;
  const [metricData, setMetricData] = useState(initialMetricData);

  let initialChartOptions = ChartConfig(
    chartProps,
    handleMetricVisibilityChange
  );

  const [chartOptions, setChartOptions] = useState<any>(initialChartOptions);
  chartOptions.metricDataItems = metricData;

  const chartData = {
    chartId: 0,
    chartName: chartName,
    userId: user && user.sub,
    metricData: [metricData[0]],
    options: chartOptions
  };

  window.history.replaceState({ chartData: null }, '');
  window.history.replaceState({ metric: null }, '');
  window.history.replaceState({ metricData: null }, '');

  useEffect(() => {
    if (visible && chartRef.current) {
      chartRef.current.chart.reflow();
    }
  }, [visible]);

  useEffect(() => {
    if (chartIsSaved) setFormState("unchanged");
    else setFormState("modified");
  }, [chartIsSaved]);

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

  useEffect(() => {
    if (metricData.length === 0) setShowIntro(true);
    else setShowIntro(false);
  }, [metricData.length]);

  useEffect(() => {
    setCurrentIndex(parseInt(activeTab));
  }, [activeTab]);

  useEffect(() => {
    if (loadingChart) {
      setLoadedChartStartTime(new Date().getTime());
    }
    else {
      if (loadedChartStartTime) {
        loadedChartEndTime = new Date().getTime();
        setLoadedChartEndTime(loadedChartEndTime);
        let loadingTime = loadedChartEndTime - loadedChartStartTime;
      }
    }
  }, [loadingChart]);

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

  useEffect(() => {
    metricData.forEach((metricItem:any) => {
      refreshMetricAxis(metricItem);
    });
  }, [metricData]);

  useEffect(() => {
    metricData.forEach((metricItem:any) => {
      refreshMetricSeries(metricItem);
    });
  }, [metricData]);

  useEffect(() => {
    window['metricData'] = metricData;

    const metricIndices = new Map();
    const metricItems = new Map();
    metricData.forEach((metric: any, index: number) => {
      metricIndices.set(metric.id, index);
      metricItems.set(metric.id, metric);
    });

    window['metricIndices'] = metricIndices;
    window['metricItems'] = metricItems;
  }, [metricData]);


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

  const handleCancel = (e: any) => {
    setMetricModalOpen(false);
  };

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

  const removeMetric = (index: any) => {
    index = Number(index);

    let metricID = metricData[index].id;

    let axisID = "axis-" + metricID;
    let axes = chart.current?.chart?.yAxis;
    if (axes) {
      let axis = axes.find((axis: any) => {
        return axis.options.id === axisID;
      });
      if (axis) axis.remove();
    }

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

  function toggleMetricVisibility(metricID: any, eventType: any) {
    let metricData = window['metricData'];
    if (!metricData) return;

    let metricItem = metricData.find((item: any) => item.id === metricID);
    let metricIndex = metricData.indexOf(metricItem);

    if (eventType === "show") showMetric(metricIndex);
    if (eventType === "hide") hideMetric(metricIndex);
  }

  function handleMetricVisibilityChange(event: any) {
    let targetSeries = event.target;

    let metricID = targetSeries?.userOptions?.id;
    if (metricID === 'highcharts-navigator-series') return;

    let eventType = event.type;
    if (eventType !== "show" && eventType !== "hide") return;

    toggleMetricVisibility(metricID, eventType);
  }

  function getMetricByID(metricID: any) {
    return metricData.find((item: any) => item.id === metricID);
  }

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

  function refreshMetricData(metricItem: any) {
    if (!metricItem) return;
    let metricIndex = metricData.indexOf(metricItem);

    if (!metricItem.id) {
      metricItem.id = getUniqueID();
      metricData[metricIndex].id = metricItem.id;
      setMetricData([...metricData]);
    }

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

    else if (metricItem.selectedMetric !== 'Formula') {
      new Promise(async resolve => {
        let data = await getHistoricalDataForMetric(metricItem);
        if (!data) data = [];

        updateMetricData(metricItem.id, data);
        updateMetricLoadedStatus(metricItem.id);

        resolve(true);
      });
    }

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

  function updateMetricData(metricID: any, data: any) {
    console.log(`Updating metric data for ID: ${metricID}`);
    let metricItem = getMetricByID(metricID);
    if (!metricItem) {
      console.error(`Metric item with ID ${metricID} not found.`);
      return; // Early return if metricItem is not found
    }
  
    console.log('Metric item found:', metricItem);
  
    let currentMetricData = window['metricData'];
    let metricIndex = currentMetricData.indexOf(metricItem);
    if (metricIndex === -1) {
      console.error(`Metric item with ID ${metricID} not found in currentMetricData.`);
      return; // Early return if metricItem is not found in the array
    }
  
    currentMetricData[metricIndex].data = data;
    setMetricData([...currentMetricData]);
    console.log('Metric data updated successfully.');
  }

  function refreshAllSeriesAndAxes() {
    metricData.forEach((metricItem:any) => {
      refreshMetricAxis(metricItem);
      refreshMetricSeries(metricItem);
    });
  }

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
      let different = false;
      if (currentSeries.options.color !== newSeriesData.color) {
        different = true;
      }
      if (currentSeries.options.data !== newSeriesData.data) {
        different = true;
      }
      if (currentSeries.options.type !== newSeriesData.type) {
        different = true;
      }
      if (currentSeries.options.name !== newSeriesData.name) {
        different = true;
      }
      if (currentSeries.options.yAxis !== newSeriesData.yAxis) {
        different = true;
      }
      if (currentSeries.options.visible !== newSeriesData.visible) {
        different = true;
      }

      if (!different) return;
      currentSeries.update(newSeriesData);
    }
    else {
      newSeriesData.visible = true;
      let renderableMetrics = metricData.filter((item: any) => item.selectedMetric !== "Formula" || item.formulaInput).length;
      let shouldRedraw = allSeries.length === ((renderableMetrics - 1) * 2);
      chart.current.chart.addSeries(newSeriesData, shouldRedraw);
    }
  }

  function createAxis(metricItem: any) {
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

    let different = false;
    if (currentAxis.options.offset !== newAxisData.offset) {
      different = true;
    }
    if (currentAxis.options.type !== newAxisData.type) {
      different = true;
    }
    if (currentAxis.options.lineColor !== newAxisData.lineColor) {
      different = true;
    }
    if (currentAxis.options.opposite !== newAxisData.opposite) {
      different = true;
    }
    if (currentAxis.options.labels?.align !== newAxisData.labels?.align) {
      different = true;
    }
    if (currentAxis.options.visible !== newAxisData.visible) {
      different = true;
    }
    if (currentAxis.options.lineWidth !== newAxisData.lineWidth) {
      different = true;
    }
    if (currentAxis.options.className !== newAxisData.className) {
      different = true;
    }

    if (!different) return;

    currentAxis.update(newAxisData);
  }

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
  }

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Open Full-Screen Chart
      </Button>
      <Modal
        visible={visible}
        onCancel={closeModal}
        footer={null}
        width="100%"
        style={{ top: 0 }}
        bodyStyle={{ height: '100vh', padding: 0 }}
        centered={true}
      >
        <div style={{ height: '100%' }}>
          {showIntro === true ? (
            <div style={styles.NewMetricContainer}>
              <div>
                <p>Add one or more metrics to start visualizing data.</p>

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

              <div style={{ ...styles.chartAndCoinContainer }}>
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

                </div>

                {loadingChart ?
                  <div style={styles.loadingChart}>
                    <p>Loading chart data...</p>
                  </div> :
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    constructorType={"stockChart"}
                    ref={chartRef}
                    className="raf"
                    callback={chartLoaded()} />}
              </div>
            </>
          )}

        </div>
      </Modal>
    </div>
  );
};

export default FullScreenChartModal;
