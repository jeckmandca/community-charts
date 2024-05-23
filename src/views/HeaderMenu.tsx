import { Menu } from "antd";
import type { MenuProps } from "antd";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { InlineStylesModel } from "../models/InlineStyleModel";

const styles: InlineStylesModel = {
  mainMenuStyle: {
    backgroundColor: "#0A0B0E",
    color: "white",
    borderRight: "none",
    fontSize: "16px",
    fontWeight: 500,
    width: "60vw",
    border: "none",
    paddingRight: "7.5vw"
  }
};

export const HeaderMenu = ({currentPlanOfCustomer}: any) => {
  const navigator = useNavigate();
  const location = useLocation();

  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type
    } as MenuItem;
  }

  let items: any = [];
  let pathName = location.pathname;
  let state = location.state;

  if (pathName === '/') {
    items = [
      getItem("Dashboard", "dashboard"),
      getItem("All Assets", "allAssets")
    ];
  }

  if (pathName === '/dashboard') {
    items = [
      getItem("Dashboard", "dashboard"),
      getItem("Market Analytics", "riskMetrics")
    ];
  }

  if (pathName === '/dashboard/allAssets') {
    if (state?.category) {
      items = [
        getItem("Dashboard", "dashboard"),
        getItem("All Assets", "allAssets"),
        getItem(state.category, "category")
      ];
    }
    else {
      items = [
        getItem("Dashboard", "dashboard"),
        getItem("All Assets", "allAssets")
      ];
    }
  }

  if (pathName === '/dashboard/riskMetrics') {
    if (currentPlanOfCustomer === 'pro') {
      if (state?.category) {
        items = [
          getItem("Dashboard", "dashboard"),
          getItem("Market Analytics", "riskMetrics"),
          getItem(state.category, "category")
        ];
      }
      else {
        items = [
          getItem("Dashboard", "dashboard"),
          getItem("Market Analytics", "riskMetrics")
        ];
      }
    }
    else {
      items = [
        getItem("Dashboard", "dashboard"),
        getItem("All Assets", "allAssets")
      ];
    }
  }

  if (pathName === '/risk') {
    items = [
      getItem("Workbench", "risk")
    ];
  }

  if (pathName === '/workbench/tutorial') {
    items = [
      getItem("Workbench Tutorial", "workbench-tutorial")
    ];
  }

  if (pathName === '/blog') {
    items = [
      getItem("Blog", "blog")
    ];
  }

  if (pathName === '/research') {
    items = [
      getItem("Research", "article")
    ];
  }

  if (pathName === '/research/newsletter') {
    items = [
      getItem("Research", "article"),
      getItem("Newsletter", "blogNews")
    ];
  }

  if (pathName === '/research/analysis') {
    items = [
      getItem("Research", "article"),
      getItem("Analysis", "blogResearch")
    ];
  }

  if (pathName === '/research/defi') {
    items = [
      getItem("Research", "article"),
      getItem("Defi", "blogDefi")
    ];
  }

  if (pathName === '/research/pro-research') {
    items = [
      getItem("Research", "article"),
      getItem("Pro Research", "blogProResearch")
    ];
  }

  if (pathName === '/research/news') {
    items = [
      getItem("Research", "article"),
      getItem("News", "blogNews")
    ];
  }

  if (pathName === '/research/public') {
    items = [
      getItem("Research", "article"),
      getItem("Public", "public")
    ];
  }

  if (pathName === '/media') {
    items = [
      getItem("Media", "media"),
      getItem("All Videos", "allVideos")
    ];
  }

  if (pathName === '/media/latest') {
    items = [
      getItem("Media", "media"),
      getItem("Latest", "mediaLatest")
    ];
  }

  if (pathName === '/media/dailyanalysis') {
    items = [
      getItem("Media", "media"),
      getItem("Daily Crypto Analysis", "mediaAnalysis")
    ];
  }

  if (pathName === '/media/upsidedowndata') {
    items = [
      getItem("Media", "media"),
      getItem("Upside Down Data", "mediaUpsideDownData")
    ];
  }

  if (pathName === '/media/investoreducation') {
    items = [
      getItem("Media", "media"),
      getItem("Investor Education", "investoreducation")
    ];
  }

  if (pathName === '/terms') {
    items = [
      getItem("Terms and Conditions", "terms")
    ];
  }

  if (pathName === '/privacy') {
    items = [
      getItem("Privacy Policy", "privacy")
    ];
  }

  const onMenuClick = (value: any) => {
    switch (value.key) {
      case "dashboard": {
        navigator("/");
        break;
      }

      case "allAssets": {
        navigator("/dashboard/allAssets");
        break;
      }

      case "riskMetrics": {
        navigator("/dashboard/riskMetrics");
        break;
      }

      case "blog": {
        navigator("/blog");
        break;
      }

      case "article": {
        navigator("/research");
        break;
      }

      case "blogNews": {
        navigator("/research/newsletter");
        break;
      }

      case "public": {
        navigator("/research/public");
        break;
      }

      case "blogResearch": {
        navigator("/research/analysis");
        break;
      }

      case "blogDefi": {
        navigator("/research/defi");
        break;
      }

      case "blogProResearch" : {
        navigator("/research/pro-research");
        break;
      }

      case "risk": {
        navigator("/risk");
        break;
      }

      case "media": {
        navigator("/media");
        break;
      }

      case "mediaLatest": {
        navigator("/media/latest");
        break;
      }

      case "mediaAnalysis": {
        navigator("/media/dailyanalysis");
        break;
      }

      case "mediaUpsideDownData": {
        navigator("/media/upsidedowndata");
        break;
      }

      case "investoreducation": {
        navigator("/media/investoreducation");
        break;
      }

      case "workbench-tutorial": {
        navigator("/workbench/tutorial");
        break;
      }
    }
  };

  return (
    <Menu
      className="header-custom-menu"
      onClick={onMenuClick}
      style={styles.mainMenuStyle}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={["sub1"]}
      mode="horizontal"
      items={items} />
  );
};
