import { Col, Row, Typography } from "antd";

import React from "react";
import { useNavigate } from "react-router-dom";

const styles:any = {
  borderRow: {
    borderBottom: "1px solid rgba(164, 164, 164, 0.35)"
  },
  individualRow: {
    marginBottom: "2vh",
    marginTop: "2vh",
    cursor: "pointer"
  },
  videoDate: {
    color: "rgb(100, 116, 139)",
    fontSize: 16
  },
  videoDescription: {
    color: "rgb(100, 116, 139)",
    fontSize: 16,
    wordBreak: 'break-all'
  },
  videoImage: {
    height: "100%",
    width: "100%",
    borderRadius: 15
  },
  videoTitle: {
    color: "white",
    fontSize: 18
  }
};

export const MediaChannelContent = ({videoList}: any) => {
  const navigator = useNavigate();

  const videoListJSX = videoList.map((video: any) => {
    const date = video.publishedAt.split("T")[0];
    const [year, month, day] = date.split("-");

    let dateFormatted = [month, day, year].join("/");
    if (dateFormatted[0] === "0") {
      dateFormatted = dateFormatted.slice(1, dateFormatted.length);
    }

    const mediaSelected = () => {
      navigator(`/media/v/${video.video_id}`);
    };

    return (
      <React.Fragment key={video.video_id}>
        <Row gutter={32} style={styles.individualRow} onClick={mediaSelected}>
          <Col xs={24} sm={11} md={10} lg={7}>
            <img src={video.thumbnails_url} style={styles.videoImage} alt={''} />
          </Col>

          <Col xs={24} sm={13} md={14} lg={17}>
            <Row className="top-margin-mobile" style={styles.videoTitle}>
              {video.title}
            </Row>

            <Row style={styles.videoDate}>{dateFormatted}</Row>

            <Typography.Paragraph style={styles.videoDescription}>
              {video.description}
            </Typography.Paragraph>
          </Col>
        </Row>

        <Row className="border-mb-m" style={styles.borderRow}></Row>
      </React.Fragment>
    );
  });

  return videoListJSX;
};
