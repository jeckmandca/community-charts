import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GhostContentAPI from "@tryghost/content-api";

import { BlogTabs } from "./BlogTabs";

const styles = {
  articleImage: {
    height: "100%",
    width: "100%",
    border: "1px solid rgba(164,164,164,.35)",
    padding: 5,
    borderRadius: 10
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
    fontSize: "1.85rem",
    fontWeight: 600,
    marginBottom: ".5vh"
  },

  featureArticleExcerpt: {
    fontSize: "1rem",
    color: "rgb(164,164,164)"
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
  },

  rowContainer: {
    width: "60vw",
    margin: "auto",
    marginTop: "4vh"
  },

  subFeatureArticleTitle: {
    color: "white",
    fontSize: "1.5rem",
    fontWeight: 600,
    marginTop: "1vh"
  },

  subArticleImage: {
    height: "100%",
    width: "100%",
    border: "1px solid rgba(164,164,164,.35)",
    padding: 5,
    borderRadius: 10
  },

  featureContainer: {
    marginTop: "4vh",
    paddingBottom: 20
  }
};

export const Blog = () => {
  const {article} = useParams();
  const [featureArticle, setFeatureArticle] = useState(null);
  const [articlesGroupedByTag, setArticlesGroupedByTag] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const callGhost = async () => {
      const api = new GhostContentAPI({
        host: "https://jesse-runner.ghost.io",
        key: "da868f5a2dddf4a1f2c377e15d",
        version: "v5"
      });

      api.posts
        .browse({ limit: "all", include: "tags,authors" })
        .then((posts) => {
          let tagKeys = [];

          posts.forEach((post) => {
            if (post.featured) setFeatureArticle(post);
            if (post.tags.length) {
              const tagExistsInKeyArray = tagKeys.find(
                (key) => key === post.tags[0].slug
              );

              if (!tagExistsInKeyArray) {
                tagKeys.push(post.tags[0].slug);
              }
            }
          });

          let groupArticlesByTag = {};
          tagKeys.forEach((key) => (groupArticlesByTag[key] = []));
          posts.forEach((post) => {
            if (post.tags.length) {
              let postTag = post.tags[0].slug;
              groupArticlesByTag[postTag].push(post);
            }
          });

          setArticlesGroupedByTag(groupArticlesByTag);
          setRecentPosts(posts.filter((post) => !post.featured));
        })
        .catch((err) => {
          console.error(err);
        });
    };

    callGhost();
  }, []);

  if (featureArticle !== null && articlesGroupedByTag !== null) {
    return (
      <div className="article-responsive-set" style={styles.rowContainer}>
        <BlogTabs
          featureArticle={featureArticle}
          recentPosts={recentPosts}
          articlesGroupedByTag={articlesGroupedByTag}
          article={article}
        />
      </div>
    );
  }
  else {
    return null;
  }
};
