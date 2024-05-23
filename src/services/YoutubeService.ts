import axios, { AxiosRequestConfig } from "axios";

export const getBackendYoutubeChannelVideos = async (channelId: string) => {
  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
    url: `https://api.polaritydigital.io/api/media/getVideos?channelId=${channelId}`,
  };

  const response = await axios(axiosOptions);
  let data = response.data.data.items;
  data.sort((a: any, b: any) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return data;
};

export const getBackendSingleYoutubeVideo = async (videoId: string) => {
  const axiosOptions: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
    url: `https://api.polaritydigital.io/api/media/getVideo?videoId=${videoId}`,
  };

  const response = await axios(axiosOptions);

  return response.data.data.items;
};
