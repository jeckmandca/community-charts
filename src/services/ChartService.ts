// file path: c:\user\jerald\desktop\community_frontend\src\services\ChartService.ts
import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from '../utils/constant';

export const ACTIONS = {
  CALL_API: 'call-api',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const initialState = {
  chartsData: '',
  chartLoading: false,
  chartError: null
};

export const chartsDataReducer = (state:any, action:any) => {
  switch (action.type) {
    case ACTIONS.CALL_API: {
      return {
        ...state,
        loading: true
      };
    }
    case ACTIONS.SUCCESS: {
      return {
        ...state,
        loading: false,
        chartsData: action.data
      };
    }
    case ACTIONS.ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error
      };
    }
  }
};

export const getCharts = async (userId:any) => {
  let url = `${BASE_URL}/api/charts/${userId}`;

  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
    url: url,
  };

  const response = await axios(axiosOptions);
  let charts = response.data.data;
  charts = charts.filter((chart:any) => chart.name);

  charts.sort((a:any, b:any) => {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });

  return charts;
};

export const getSingleChart = async (id: any) => {
  let url = `${BASE_URL}/api/chart/${id}`;

  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
    url: url
  };

  const response = await axios(axiosOptions);
  let chartData = response.data.data;
  if (typeof chartData.metric_tab_data === 'string') {
    try {
      chartData.metric_tab_data = JSON.parse(chartData.metric_tab_data);
    }
    catch(e) {
      chartData.metric_tab_data = [];
    }
  }

  return chartData;
};

export const saveCharts = async (data:any, yAxis:any) => {
  let newMetricData:any =[];

  data.metricData.map((res:any,i:any)=>{
    newMetricData.push({
      ...res,
      data: null,
      selectedCrypto: {
        id: res.selectedCrypto?.id,
        coin_id: res.selectedCrypto?.coin_id,
        symbol: res.selectedCrypto?.symbol
      }
    });
  });

  let body = {
    user_id: data.userId,
    name: data.chartName,
    metric_tab_data: [...newMetricData],
    configuration: yAxis
  }

  let url = `${BASE_URL}/api/charts/add`;
  const response = await axios.post(url, body);
  return response.data.data;
};

export const updateSingleChart = async (metricData:any, chartOptions:any, id:any) => {
  let newMetricData:any =[];

  metricData.map((res:any,i:any)=>{
    newMetricData.push({
      ...res,
      data: null,
      selectedCrypto: {
        id: res.selectedCrypto?.id,
        coin_id: res.selectedCrypto?.coin_id,
        symbol: res.selectedCrypto?.symbol
      }
    });
  });

  let options = {
    type: chartOptions.chart.type,
    yAxis: chartOptions.yAxis
  };

  let body = {
    metric_tab_data: [...newMetricData],
    configuration: options
  };

  let url = `${BASE_URL}/api/charts/update/${id}`;
  const response = await axios.put(url, body);
  return response.data.data;
};

export const deleteSingleChart = async (id:any) => {
  let url = `${BASE_URL}/api/charts/delete/${id}`;

  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "delete",
    url: url
  };

  const response = await axios(axiosOptions);
  return response.data.data;
};

export const publishCommunityChart = async (id: any, confirmUpdate: boolean = false) => {
  let url = `${BASE_URL}/api/charts/publishCommunityChart/${id}`;
  const body = { confirmUpdate };

  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    url: url,
    data: body
  };

  const response = await axios(axiosOptions);
  console.log("Backend response:", response);
  return response;
};


