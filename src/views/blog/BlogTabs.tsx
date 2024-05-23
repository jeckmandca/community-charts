import { Row, Tabs } from "antd";
import { useNavigate } from "react-router-dom";

import { BlogGenericTabContent } from "./BlogGenericTabContent";
import { BlogOverviewTabContent } from "./BlogOverviewTabContent";
import { FeaturedArticle } from "./FeaturedArticle";
import { RecentPosts } from "./RecentPosts";
import { defaultTab, article2tab, tab2article } from "./BlogMap";

const { TabPane } = Tabs;

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

export const BlogTabs = ({
  featureArticle,
  recentPosts,
  articlesGroupedByTag,
  article
}: any) => {
  let navigate = useNavigate();
  let activeTab = article2tab(article);

  const handleActiveTab = (e: any) => {
    let article = tab2article(e);
    navigate(`/research/${article}`);
  };

  let tabPanesJSX:any = '';
  if (articlesGroupedByTag !== null) {
    tabPanesJSX = Object.keys(articlesGroupedByTag).map((key, index) => (
      <TabPane
        tab={
          key === "research" ? "Analysis" : key === "pro-research"
            ? 'Pro Research' : key[0].toUpperCase() + key.substring(1)
        }
        key={index + 1}
        style={{ fontSize: 20 }}>
        <BlogGenericTabContent
          articlesGroupedByTag={articlesGroupedByTag}
          tabKey={key} />
      </TabPane>
    ));
  }

  return (
    <Tabs
      className="custom-tab-rspv"
      activeKey={activeTab}
      onChange={(e) => handleActiveTab(e)}
      defaultActiveKey={defaultTab}>
      <TabPane tab="Overview" key="0">
        <FeaturedArticle featuredPost={featureArticle} showTag={true} />

        <Row className="antiiirow">
          <h2 style={styles.ourPicksHeader}>{"Latest"}</h2>
        </Row>

        <Row>
          <h3 style={styles.ourPicksSubHeader}>
            {"Recently Published Articles"}
          </h3>
        </Row>

        <RecentPosts recentPosts={recentPosts} />

        <BlogOverviewTabContent articlesGroupedByTag={articlesGroupedByTag} />
      </TabPane>
      {tabPanesJSX}
    </Tabs>
  );
};
