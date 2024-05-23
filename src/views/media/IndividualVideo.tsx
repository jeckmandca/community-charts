import { Row } from "antd";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import './Media.css';

import { getBackendSingleYoutubeVideo } from "../../services/YoutubeService";

const styles = {
  borderRow: {
    borderBottom: "1px solid rgba(164, 164, 164, 0.35)",
    marginTop: "20px",
    marginBottom: "12px",
    width: "auto",
    height: "auto"
  },
  rowContainer: {
    width: "auto",
    height: "auto",
    margin: "2%",
    marginTop: "2%"
  },
  videoDescription: {
    color: "white",
    fontSize: 16,
    marginLeft: "auto"
  }
};

export const IndividualVideo = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<any>(null);

  useEffect(() => {
    if (!video) {
      const fetchSingleVideo = async () => {
        const videoData = await getBackendSingleYoutubeVideo(videoId as string);
        setVideo(videoData);
      };
      fetchSingleVideo();
    }
  }, [videoId, video]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="article-responsive-set" style={styles.rowContainer}>
      <Row justify="space-evenly">
        <div className="video-responsive-wrapper">
          <iframe
            className="video-responsive-iframe"
            src={`https://www.youtube.com/embed/${video[0].video_id}`}
            frameBorder="0"
            allowFullScreen
            title="Embedded youtube"></iframe>
        </div>
      </Row>

      <Row style={styles.borderRow}></Row>

      <Row style={styles.videoDescription} justify="center">
        {video[0].description}
      </Row>
    </div>
  );
};
