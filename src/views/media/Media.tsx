import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./Media.css";

import { MediaTabs } from "./MediaTabs";
import { getBackendYoutubeChannelVideos } from "../../services/YoutubeService";

export const Media = () => {
  const [videoList, setVideoList] = useState<any>(null);
  const { channel } = useParams();

  useEffect(() => {
    const asyncFetchChannelInformation = async () => {
      const dcaChannel = await getBackendYoutubeChannelVideos(
        "UC_bG7yHgT_xOUKvI2Hvo6Vg"
      );
      const upddChannel = await getBackendYoutubeChannelVideos(
        "UCzECtg05OBc2sE1KsRnHK7g"
      );

      let allVideosOrder = [...dcaChannel, ...upddChannel]
        .sort((a, b) => {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });

      setVideoList([
        allVideosOrder,
        dcaChannel,
        upddChannel
      ]);
    };

    if (videoList === null) asyncFetchChannelInformation();
  });

  return (
    <div className="tab-container">
      <MediaTabs
        videoList={videoList}
        setVideoList={setVideoList}
        channel={channel} />
    </div>
  );
};
