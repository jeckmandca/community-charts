import { Tabs } from "antd";

import { useNavigate } from "react-router-dom";

import "./Media.css";

import { defaultTab, channel2tab, tab2channel } from "./MediaMap";
import { MediaChannelContent } from "./MediaChannelContent";

const { TabPane } = Tabs;

export const MediaTabs = ({ videoList, channel }: any) => {
  const channelTabs = [
    "All Videos",
    "Daily Crypto Analysis",
    "Upside Down Data",
  ];

  let navigate = useNavigate();
  let activeTab = channel2tab(channel);

  const handleActiveTab = (e: any) => {
    let media = tab2channel(e);
    navigate(`/media/${media}`);
  };

  let tabPanesJSX = null;
  if (videoList !== null) {
    tabPanesJSX = channelTabs.map((channel: string, index: number) => (
      <TabPane
        className="custom-responsive-tab"
        tab={channel}
        key={index}
        style={{fontSize: 20}}>
        <MediaChannelContent videoList={videoList[index]} />
      </TabPane>
    ));
  }

  return (
    <Tabs
      className="tab-set"
      activeKey={activeTab}
      onChange={handleActiveTab}
      defaultActiveKey={defaultTab}>
      {tabPanesJSX}
    </Tabs>
  );
};
