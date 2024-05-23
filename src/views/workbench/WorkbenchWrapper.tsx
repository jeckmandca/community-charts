import { useEffect, useState } from "react";

import {getDashboardData, getAllMetrics, getEconomicSeries} from "../../services/MetricService";
import {Workbench} from "./Workbench";

export const WorkbenchWrapper = ({
  currentPlanOfCustomer,
  setCurrentPlanOfCustomer,
  customerData,
  getSubDetailOfCustomer,
  subStatus
}:any) => {
  const [top100Coins, setTop100Coins] = useState<any>(null);
  const [metrics, setMetrics] = useState([]);
  const [metricsNameMap, setMetricsNameMap] = useState({});
  const [metricsKeyMap, setMetricsKeyMap] = useState({});
  const [seriesIDMap, setSeriesIDMap] = useState({});
  const [series, setSeries] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [coinSymbolsMap, setCoinSymbolsMap] = useState<any>({});

  useEffect(() => {
    const getTop100Coins = async () => {
      const coinData = await getDashboardData('',[],[]);
      let coinSymbols = coinData?.map((coin: any) => coin.symbol.toUpperCase());
      let coinSymbolsMap: any = {};
      coinSymbols?.forEach((symbol: any) => {
        coinSymbolsMap[symbol] = true;
      });

      setCoinSymbolsMap(coinSymbolsMap);
      setTop100Coins(coinData);
    };

    const getMetrics = async () => {
      const metricsData = await getAllMetrics();
      const economicData = await getEconomicSeries();

      prepareMaps(metricsData, economicData);

      setMetrics(metricsData);
      setSeries(economicData);
    }

    const getAllData = async () => {
      await getTop100Coins();
      await getMetrics();

      setDataLoaded(true);
    }

    getAllData();
  }, []);

  function prepareMaps(metricsData: any, economicData: any) {
    let metricsNameMap: any = {};
    let metricsKeyMap: any = {};
    let seriesIDMap: any = {};

    metricsData.allWorkbenchMetrics.forEach((metric: any) => {
      metricsNameMap[metric.name] = metric;
      metricsKeyMap[metric.key] = metric;
    });

    economicData.allSeries.forEach((serie: any) => {
      seriesIDMap[serie.series_id] = serie;
    });

    setMetricsNameMap(metricsNameMap);
    setMetricsKeyMap(metricsKeyMap);
    setSeriesIDMap(seriesIDMap);
  }

  return (
    <>
      <div style={{
        width: "90%",
        marginTop: "20px",
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom: '20px'
      }}>
        {dataLoaded ? (
          <div>
            <Workbench
              coinData={top100Coins}
              currentPlanOfCustomer={currentPlanOfCustomer}
              setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
              customerData={customerData}
              getSubDetailOfCustomer={getSubDetailOfCustomer}
              subStatus={subStatus}
              metrics={metrics}
              metricsNameMap={metricsNameMap}
              metricsKeyMap={metricsKeyMap}
              seriesIDMap={seriesIDMap}
              series={series}
              coinSymbolsMap={coinSymbolsMap} />
          </div>
        ) : (
          <div className="loader">
            <div className="loader__figure"></div>
          </div>
        )}
      </div>
    </>
  );
};
