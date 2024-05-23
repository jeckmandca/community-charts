import { Row, Typography } from "antd";

import { useNavigate } from "react-router-dom";

const styles = {
  postAuthor: {
    fontSize: ".75rem",
    color: "rgb(164,164,164)",
    fontWeight: 700,
    marginBottom: ".5vh"
  },

  title: {
    color: "white",
    fontSize: "1.2rem",
    fontWeight: 600,
    marginTop: "1vh"
  },

  subArticleImage: {
    height: "100%",
    width: "100%",
    border: "1px solid rgba(164,164,164,.35)",
    padding: 5,
    borderRadius: 10,
    marginBottom: '8px'
  },

  postExcerpt: {
    fontSize: "1rem",
    color: "rgb(164,164,164)"
  }
};

export const PostCard = ({ post, titleFont }: any) => {
  const navigator = useNavigate();

  const headlineSelected = () => {
    navigator(`/research/p/${post.slug}`);
  };

  return (
    <div onClick={headlineSelected}>
      <Row style={{ aspectRatio: "16/9" }}>
        <img
          className="subarticle-responsive"
          style={styles.subArticleImage}
          src={post.feature_image}
          alt={post.title} />
      </Row>

      <Row
        style={{ ...styles.title, fontSize: titleFont }}
        className="feature-article-title">
        {post.title}
      </Row>

      <Row style={styles.postAuthor}>
        {post.authors.length
          ? `by ${post.authors[0].name} - ${post.published_at.substring(0, post.published_at.indexOf("T"))}`
          : "by Polarity Digital"}
      </Row>

      <Row>
        <Typography.Paragraph ellipsis={{ rows: 5 }} style={styles.postExcerpt}>
          {post.excerpt}
        </Typography.Paragraph>
      </Row>
    </div>
  );
};
