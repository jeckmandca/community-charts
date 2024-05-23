import { Col, Row } from "antd";

import { FeaturedArticle } from "./FeaturedArticle";
import { PostCard } from "./PostCard";

const styles = {
  columnDivider: {
    borderRight: "1px solid rgba(165,165,165,.35)"
  },
  columnPointerMouseEffect: {
    cursor: "pointer"
  }
};

export const RecentPosts = ({ recentPosts }: any) => {
  if (recentPosts.length) {
    if (recentPosts.length === 1) {
      return (
        <Col span={24} style={styles.columnPointerMouseEffect}>
          <FeaturedArticle featuredPost={recentPosts[0]} />
        </Col>
      );
    }
    else if (recentPosts.length === 2) {
      return (
        <Row gutter={32} justify="space-between">
          <Col
            span={12}
            style={{
              ...styles.columnDivider,
              ...styles.columnPointerMouseEffect
            }}>
            <PostCard post={recentPosts[0]} titleFont={"1.5rem"} />
          </Col>

          <Col span={12} style={styles.columnPointerMouseEffect}>
            <PostCard post={recentPosts[1]} titleFont={"1.5rem"} />
          </Col>
        </Row>
      );
    }
    else if (recentPosts.length === 3) {
      return (
        <Row gutter={32}>
          <Col xl={8} md={12} style={styles.columnPointerMouseEffect}>
            <PostCard post={recentPosts[0]} titleFont={"1.25rem"} />
          </Col>

          <Col className="w-100-m" xl={8} md={12} style={styles.columnPointerMouseEffect}>
            <PostCard post={recentPosts[1]} titleFont={"1.25rem"} />
          </Col>

          <Col xl={8} md={0} style={styles.columnPointerMouseEffect}>
            <PostCard post={recentPosts[2]} titleFont={"1.25rem"} />
          </Col>
        </Row>
      );
    }
    else {
      return (
        <Row gutter={32}>
          <Col className="mobile-border-none"
            md={12}
            xxl={6}
            lg={8}
            style={{
              ...styles.columnDivider,
              ...styles.columnPointerMouseEffect
            }}>
            <PostCard post={recentPosts[0]} titleFont={"1.25rem"} />
          </Col>

          <Col className="mobile-border-none"
            md={12}
            lg={8}
            xxl={6}
            style={{
              ...styles.columnDivider,
              ...styles.columnPointerMouseEffect
            }}>
            <PostCard post={recentPosts[1]} titleFont={"1.25rem"} />
          </Col>

          <Col className="mobile-border-none"
            md={0}
            lg={8}
            xxl={6}
            style={{
              ...styles.columnDivider,
              ...styles.columnPointerMouseEffect
            }}>
            <PostCard post={recentPosts[2]} titleFont={"1.25rem"} />
          </Col>

          <Col
            className="mobile-border-none w-100-m"
            xxl={6}
            lg={8}
            md={12}
            style={styles.columnPointerMouseEffect}>
            <PostCard post={recentPosts[3]} titleFont={"1.25rem"} />
          </Col>
        </Row>
      );
    }
  }
  else {
    return null;
  }
};
