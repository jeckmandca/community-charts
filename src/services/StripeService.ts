import axios, {AxiosRequestConfig} from "axios";
import {BASE_URL} from '../utils/constant';

export const createSubscription = async (data: any) => {
  try {
    let url = `${BASE_URL}/api/createSubscription`;
    const response = await axios.post(url, data);
    return response.data;
  }
  catch(err: any) {
    return err?.response.data;
  }
};

export const cancelSubscription = async (subID: any) => {
  let url = `${BASE_URL}/api/cancelSubscription/${subID}`;
  const response = (await axios.get(url)).data;

  if (response.data.cancel_at_period_end === true)
    response.data.status = 'canceled';

  return response;
};

export const renewSubscription = async (subID: any) => {
  let url = `${BASE_URL}/api/renewSubscription/${subID}`;
  const response = await axios.get(url);
  return response.data;
};

export const getPlans = async () => {
  let url = `${BASE_URL}/api/plans`;
  const response = await axios.get(url);
  return response.data.data;
};

export const getSubscription = async () => {
  try {
    const axiosOptions: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
      url: `${BASE_URL}/api/getSubscription`
    };

    let accessToken = localStorage.getItem("idToken");
    if (accessToken && axiosOptions.headers)
      axiosOptions.headers["Authorization"] = `Bearer ${accessToken}`;

    const response = await axios(axiosOptions);
    return response.data.data;
  }
  catch(err: any) {
    return err?.response.data;
  }
};

export const getSinglePlan = async (priceId: any) => {
  let url = `${BASE_URL}/api/plan/${priceId}`;
  const response = await axios.get(url);
  return response.data.data;
};

export const savePaidCustomer = async (body: any, status: any) => {
  body.status = status;
  let url = `${BASE_URL}/api/updatePaidCustomer`;
  const response = await axios.post(url, body);
  return response.data.data;
}

export const calculateTax  = async (body: any) => {
  let url = `${BASE_URL}/api/calculateTax`;
  const response = await axios.post(url, body);
  return response.data.data;
}

export const getPaymentDetail = async () => {
  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
    url: `${BASE_URL}/api/customerPaymentDetail`
  };

  let accessToken = localStorage.getItem("idToken");
  if (accessToken && axiosOptions.headers)
    axiosOptions.headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await axios(axiosOptions);
  return response.data.data;
}

export const updatePaymentDetail = async (body: any) => {
  try {
    let url = `${BASE_URL}/api/updateCusPaymentDetail`;
    const response = await axios.post(url, body);
    return response.data;
  }
  catch(error: any) {
    return error?.response.data;
  }
}

export const updateSubscription = async (body: any) => {
  try {
    let url = `${BASE_URL}/api/updateSubscription`;
    const response = await axios.post(url, body);
    return response.data;
  }
  catch(error: any) {
    return error?.response.data;
  }
}

export const addPromoCode = async (body: any) => {
  try {
    let url = `${BASE_URL}/api/listPromoCodeOfCustomer`;
    const response = await axios.post(url, body);
    return response.data;
  }
  catch(error: any) {
    return error?.response.data;
  }
}
