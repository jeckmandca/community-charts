import { Col, Row } from "antd";

import { useNavigate } from "react-router-dom";

const styles = {
  articleImage: {
    height: "100%",
    width: "100%",
    border: "1px solid rgba(164,164,164,.35)",
    padding: 5,
    borderRadius: 10
  },

  featureContainer: {
    paddingBottom: 20,
    cursor: "pointer",
    borderBottom: "1px solid rgba(165,165,165,.5)",
    marginBottom: '20px'
  },

  featureArticleAuthor: {
    fontSize: ".75rem",
    color: "rgb(164,164,164)",
    fontWeight: 700,
    marginBottom: ".5vh"
  },

  featureArticleTag: {
    color: "white",
    fontWeight: 600,
    marginBottom: ".5vh"
  },

  featureArticleTitle: {
    color: "white",
    fontSize: "1.75rem",
    fontWeight: 600,
    marginBottom: ".5vh"
  },

  featureArticleExcerpt: {
    fontSize: "1rem",
    color: "rgb(164,164,164)"
  }
};

export const FeaturedArticle = ({ featuredPost, showTag }: any) => {
  const navigator = useNavigate();

  const headlineSelected = () => {
    navigator(`/research/p/${featuredPost.slug}`);
  };

  return (
    <Row
      className="feature-article-container"
      style={styles.featureContainer}
      gutter={32}
      onClick={headlineSelected}>
      <Col className="feature-article-left" xs={24} sm={24} md={10}>
        {showTag ? (
          <Row style={styles.featureArticleTag}>{"Featured Article"}</Row>
        ) : null}

        <Row
          style={styles.featureArticleTitle}
          className="feature-article-title">
          {featuredPost.title}
        </Row>

        <Row style={styles.featureArticleAuthor}>
          {featuredPost.authors.length
            ? `by ${featuredPost.authors[0].name} - ${featuredPost.published_at.substring(0, featuredPost.published_at.indexOf("T"))}`
            : "by Polarity Digital"}
        </Row>

        <Row style={styles.featureArticleExcerpt}>
          <p>{featuredPost.excerpt}</p>
        </Row>
      </Col>

      <Col className="feature-article-right" xs={24} sm={24} md={14} style={{ aspectRatio: "16/9" }}>
        <img style={styles.articleImage} src={featuredPost.feature_image} alt={''} />
      </Col>
    </Row>
  );
};
