import {Row, Select, Button } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

import { useEffect, useRef, useState } from "react";

import { InlineStylesModel } from "../../models/InlineStyleModel";

import { getDashboardData } from "../../services/MetricService";
import { getAllMetrics} from "../../services/MetricService";
import { DashboardTable } from "./DashboardTable";

const styles: InlineStylesModel = {
  chartSpacing: {
    height: "49%"
  },
  dashboardPageTitle: {
    fontSize: 30,
    fontWeight: 400,
    color: "white"
  },
  dashAndChartContainer: {
    width: "100%"
  },
  tableSpacing: {
    width: "100%"
  },
  mt10: {
    marginTop: "10vh"
  },
  footerStyle: {
    marginTop: "10vw",
    background: "skyblue"
  }
};

export const Dashboard = ({
  currentPlanOfCustomer,
  setCurrentPlanOfCustomer,
  customerData,
  subStatus,
  getSubDetailOfCustomer
}: any) => {
  const ref = useRef<HTMLDivElement>(null);

  const [top100Coins, setTop100Coins] = useState<any>(null);
  const [combinedData, setCombinedData] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [perPage, setPerPage] = useState("50");
  const [category, setCategory] = useState("");
  const [riskMetricsEnabled, setRiskMetricsEnabled] = useState(0);
  const [tabValue, setTabValue] = useState('All Coins');
  const [volume, setVolume] = useState([]);
  const [marketCap, setMarketCap] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getTop100Coins = async () => {
      setLoader(true);

      let coinData: any;
      coinData = await getDashboardData(category, volume, marketCap);
      if (coinData) {
        setLoader(false)
      }

      if (riskMetricsEnabled === 1) {
        coinData = coinData.filter((item: any) => item.risk_exist === 1);
      }

      setTop100Coins(coinData);
      setCombinedData(coinData);
    };

    const getMetrics = async () => {
      let metrics = await getAllMetrics();
      setMetrics(metrics);
    }

    getTop100Coins();
    getMetrics();
  }, [
    perPage,
    riskMetricsEnabled,
    category,
    tabValue,
    volume,
    marketCap
  ]);

  const paginationOptions: any[] | undefined = [
    {
      value: "10",
      label: "10 rows per page"
    },
    {
      value: "25",
      label: "25 rows per page"
    },
    {
      value: "50",
      label: "50 rows per page"
    },
    {
      value: "100",
      label: "100 rows per page"
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handlePagination = (value: any) => {
    setPerPage(value);
  };

  return (
    <>
      {metrics !== null && top100Coins !== null ? (
        <>
          <Row style={styles.dashAndChartContainer}>
            <div style={styles.tableSpacing} ref={ref}>
              <DashboardTable
                metrics={metrics}
                coinData={top100Coins}
                setRiskMetricsEnabled={setRiskMetricsEnabled}
                combinedData={combinedData}
                setCombinedData={setCombinedData}
                perPage={perPage === "select per page" ? "250" : perPage}
                setCategory={setCategory}
                currentPlanOfCustomer={currentPlanOfCustomer}
                setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
                customerData={customerData}
                tabValue={tabValue}
                setTabValue={setTabValue}
                volume={volume}
                setVolume={setVolume}
                marketCap={marketCap}
                setMarketCap={setMarketCap}
                loader={loader}
                subStatus={subStatus}
                getSubDetailOfCustomer={getSubDetailOfCustomer} />
            </div>
          </Row>

          <Row style={styles.dashAndChartContainer}>
            <div className="page-selector">
              <Select
                defaultValue="Select page"
                options={paginationOptions}
                onChange={(e) => handlePagination(e)}
                value={perPage} />
            </div>
          </Row>

          <Button id="scrollToTopButton" onClick={scrollToTop}>
            <ArrowUpOutlined />
          </Button>
        </>) : (<div>Loading...</div>)
      }
    </>
  );
};
