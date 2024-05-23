import axios, { AxiosRequestConfig } from "axios";

export const GetCoingeckoCategories = async () => {
  let url = `https://api.coingecko.com/api/v3/coins/categories`;

  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
    url: url
  };

  const response = await axios(axiosOptions);
  return response.data;
};
