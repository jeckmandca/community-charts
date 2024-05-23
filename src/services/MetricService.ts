import axios, { AxiosRequestConfig } from "axios";
import {BASE_URL} from '../utils/constant'
import {processMetricFormula} from "../views/workbench/formulas/FormulaProcessing";

export const getAllMetrics = async () => {
  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "get",
    url: `${BASE_URL}/api/metrics`
  };

  const response = await axios(axiosOptions);
  return response.data.data;
};

export const getEconomicSeries = async () => {
  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "get",
    url: `${BASE_URL}/api/series`
  };

  const response = await axios(axiosOptions);
  return response.data.data;
}

export const getDashboardData = async (category?: any, volume?: any, market_cap?: any) => {
  let params:any = {};

  if (category) params.category = category;
  if (volume?.length) params.volume = volume;
  if (market_cap?.length) params.market_cap = market_cap;

  let urlParams = new URLSearchParams(params).toString();

  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "get",
    url: `${BASE_URL}/api/dashboardData?${urlParams}`
  };

  let accessToken = localStorage.getItem("idToken");
  if (accessToken && axiosOptions.headers)
    axiosOptions.headers["Authorization"] = `Bearer ${accessToken}`;

  let response = await axios(axiosOptions);
  let data = response.data.data.data;

  while (!data || data.length === 0 || data[0].coin_id !== "bitcoin") {
    await new Promise(resolve => setTimeout(resolve, 1000));
    response = await axios(axiosOptions);
    data = response.data.data.data;
  }

  return data;
};

export const getEconomicData = async (
  metricItem: any
) => {
  let seriesID = metricItem.selectedMetric;
  let url = `${BASE_URL}/api/economicData/${seriesID}`;
  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
    url: url,
  };
  const response = await axios(axiosOptions);

  let economicData = response.data.data.data.observations;

  let data = economicData.map((row: any) => {
    let date = row.date.split("-");
    row.date = Date.UTC(date[0], Number(date[1]) - 1, date[2]);

    return [row.date, Number(row.value)];
  });

  return processMetricFormula(metricItem, data);
};

export const getHistoricalData = async (coin: string, metric?: string) => {
  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
    url: `${BASE_URL}/api/historicalData?coin=${coin}&metric=${metric}`,
  };

  let accessToken = localStorage.getItem("idToken");
  if (accessToken && axiosOptions.headers)
    axiosOptions.headers["Authorization"] = `Bearer ${accessToken}`;

  try {
    const response = await axios(axiosOptions);
    return response.data.data;
  }
  catch (e) {
    return [];
  }
}

export const getHistoricalDataForMetric = async (
  metricItem: any
) => {
  try {
    let coin = metricItem?.selectedCrypto?.symbol;
    let metric = metricItem.selectedMetric;

    if (metric === 'Price') metric = 'price';
    if (metric === 'cs') metric = 'circulating_supply';
    if (metric === 'mc') metric = 'market_cap';
    if (metric === 'volume') metric = 'total_volume';
    if (metric === 'TCI') metric = 'tci';
    if (metric === 'TCI_CV') metric = 'tcicv';
    if (metric === 'MCM') metric = 'mcm';
    if (metric === 'MBI') metric = 'mbi';
    if (metric === 'MDC_CV') metric = 'mdccv';
    if (metric === 'UDPI_S') metric = 'udpis';
    if (metric === 'UDPI_M') metric = 'udpim';
    if (metric === 'UDPI_L') metric = 'udpil';

    if (coin) {
      let priceData = await getHistoricalData(coin, metric);

      let data = priceData.map((res: any, i: any) => {
        let date = res.closetime.split("-")
        res.closetime = Date.UTC(date[0], Number(date[1]) - 1, date[2]);
        res = Object.values(res)
        res[1] = res[1] !== undefined ? Number(res[1]) : res[1];

        return res;
      });

      return processMetricFormula(metricItem, data);
    }
  }
  catch(e) {
    console.log(e);
  }
}
