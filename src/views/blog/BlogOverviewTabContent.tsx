import { Row } from "antd";

import { RecentPosts } from "./RecentPosts";

const styles = {
  ourPicksHeader: {
    color: "white",
    fontSize: "26px",
    marginTop: ".5vh"
  },
  ourPicksSubHeader: {
    color: "rgb(164,164,164)",
    fontSize: "16px",
    fontWeight: 399,
    marginBottom: "2vh"
  }
};

// this uses the keys array to map out one row per tag key as the basis of the home page
export const BlogOverviewTabContent = ({ articlesGroupedByTag }: any) => {
  return (
    <>
      {Object.keys(articlesGroupedByTag).map((key) => (
        <>
          <Row>
            <h2 style={styles.ourPicksHeader}>
              {key[0].toUpperCase() + key.substring(1)}
            </h2>
          </Row>

          <Row>
            <h3 style={styles.ourPicksSubHeader}>
              {"Recently Published Articles"}
            </h3>
          </Row>

          <RecentPosts recentPosts={articlesGroupedByTag[key]} />
        </>
      ))}
    </>
  );
};
