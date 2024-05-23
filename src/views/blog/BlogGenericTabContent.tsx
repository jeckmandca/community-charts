import { Col, Row} from "antd";

import { FeaturedArticle } from "./FeaturedArticle";
import { PostCard } from "./PostCard";

const styles = {
  columnPointerMouseEffect: {
    cursor: "pointer"
  },

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

export const BlogGenericTabContent = ({
  articlesGroupedByTag,
  tabKey,
}: any) => {
  const allArticles = articlesGroupedByTag[tabKey].map((post: any) => {
    return (
      <Col xs={24} sm={12} md={12} lg={6} style={styles.columnPointerMouseEffect}>
        <PostCard post={post} titleFont={"1.25rem"} />
      </Col>
    );
  });

  return (
    <>
      <FeaturedArticle featuredPost={articlesGroupedByTag[tabKey][0]} />
      <Row gutter={32}>{allArticles !== undefined ? allArticles : null}</Row>
    </>
  );
};
