import { Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./Blog.css";

import GhostContentAPI from "@tryghost/content-api";

const styles = {
  articleImage: {
    height: "100%",
    width: "100%",
    border: "1px solid rgba(164,164,164,.35)",
    padding: 5,
    borderRadius: 10,
    marginTop: '10px'
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
    fontSize: "2.5rem",
    fontWeight: 600,
    marginBottom: ".5vh"
  },

  featureArticleExcerpt: {
    fontSize: "1rem",
    color: "rgb(164,164,164)"
  }
};

export const IndividualPost = () => {
  const { postTitle } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const api = new GhostContentAPI({
      host: "https://jesse-runner.ghost.io",
      key: "da868f5a2dddf4a1f2c377e15d",
      version: "v5"
    });

    api.posts
      .browse({ filter: `slug: ${postTitle}`, include: "tags,authors" })
      .then((posts) => {
        if (posts[0] !== undefined) {
          let article = posts[0];
          if (article.html) {
            article.html = article.html.replace('width="200" height="113"', 'width="100%" height="100%"');
          }
          setArticle(article);
        }
      });
  }, [postTitle]);

  if (article === null) {
    return (
      <Row
        style={{ width: "40vw", height: "30vh" }}
        justify="center"
        align="middle">
        <Spin />
      </Row>
    );
  }

  return (
    <div className="article-responsive-set"
      style={{
        width: "50vw",
        color: "white",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "750px",
        marginTop: "2vh"
      }}>
      <Row style={styles.featureArticleTitle} className="feature-article-title">
        {article.title}
      </Row>

      <Row style={styles.featureArticleAuthor}>
        {article.authors.length
          ? `by ${article.authors[0].name} - ${article.published_at.substring(0, article.published_at.indexOf("T"))}`
          : "by Polarity Digital"}
      </Row>

      <Row style={{ aspectRatio: "16/9", width: "100%" }}>
        <img style={styles.articleImage} src={article.feature_image} alt={''} />
      </Row>

      <div style={{ marginTop: "2.5vh" }}
           dangerouslySetInnerHTML={{ __html: `${article.html}` }}></div>
    </div>
  );
};
