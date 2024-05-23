import { Row, Spin, Table } from "antd";

import { useEffect, useState, useRef } from "react";

import TooltipWrapper from "./tooltip/Tooltip";
import { GetCoingeckoCategories } from "../../services/CoingeckoService";
import DashboardHeader from "./header/DashboardHeader";

import ValueCell from "./cells/ValueCell";
import AssetCell from "./cells/AssetCell";
import MarketCapRankCell from "./cells/MarketCapRankCell";
import SparklineCell from "./cells/SparklineCell";

export const DashboardTable = ({
  metrics,
  coinData,
  setRiskMetricsEnabled,
  combinedData,
  setCombinedData,
  perPage,
  setCategory,
  currentPlanOfCustomer,
  setCurrentPlanOfCustomer,
  customerData,
  tabValue,
  setTabValue,
  volume,
  setVolume,
  marketCap,
  setMarketCap,
  loader,
  subStatus,
  getSubDetailOfCustomer
}: any) => {
  const ScreenWidth = useRef(window.innerWidth);

  const [minMarketCap, setMinMarketCap] = useState(0);
  const [maxMarketCap, setMaxMarketCap] = useState(0);
  const [minVolume, setMinVolume] = useState(0);
  const [maxVolume, setMaxVolume] = useState(0);
  let [columns, setColumns] = useState([]);
  let [defaultColumns, setDefaultColumns]: any = useState([]);
  let [allCategories, setAllCategories] = useState<any>([]);

  const [freeDefaults, setFreeDefaults] = useState(metrics
    .allDashboardMetrics
    .filter((metric: any) => !metric.pro && metric.default_on_all)
    .map((metric: any) => metric.key)
  );
  const [proDefaults, setProDefaults] = useState(metrics
    .allDashboardMetrics
    .filter((metric: any) => metric.default_on_pro)
    .map((metric: any) => metric.key)
  );
  const [selectedOption, setSelectedOption] = useState(metrics
    .allDashboardMetrics
    .filter((metric: any) => !metric.pro && metric.default_on_all)
    .map((metric: any) => metric.key)
  );

  const setColumnDefinitions = () => {
    let columnsDefinitions:any = [
      {
        title: '#',
        dataIndex: 'market_cap_rank',
        key: 'market_cap_rank',
        fixed: 'left',
        width: ScreenWidth.current < 800 ? 120 :
          ScreenWidth.current > 800 && ScreenWidth.current < 1200 ? 75 :
          ScreenWidth.current > 1200 ? 100 : 100,
        sorter: (a: any, b: any) => a?.market_cap_rank - b?.market_cap_rank,
        sortDirections: ['ascend', 'descend', null],
        render: (text: any) => <MarketCapRankCell text={text} />
      },
      {
        title: 'Name',
        dataIndex: ['symbol', 'image'],
        key: 'name',
        fixed: 'left',
        render: (text: any, data: any) => <AssetCell text={text} data={data} />
      }
    ];

    metrics.allDashboardMetrics.forEach((metric: any) => {
      let columnDefinition: any;

      if (metric.display_type !== 'chart') {
        columnDefinition = {
          title: <span>{metric.name}</span>,
          dataIndex: metric.key,
          key: metric.key,
          sorter: (a: any, b: any) => {
            let numberA = a[metric.key];
            let numberB = b[metric.key];
            if (isNaN(numberA) || numberA === null || numberA === undefined) numberA = 0;
            if (isNaN(numberB) || numberB === null || numberB === undefined) numberB = 0;
            return Number(numberA) - Number(numberB);
          },
          sortDirections: ['ascend', 'descend', null],
          render: (text: any, data: any) => <ValueCell
            cellValue={text} data={data} metric={metric.key} metricData={metric} />
        };
      }
      else {
        columnDefinition = {
          title: <span>{metric.name}</span>,
          dataIndex: [metric.key, 'price'],
          key: metric.key,
          render: (text: any, data: any) => <SparklineCell data={data} />
        };
      }

      if (metric.tooltip) {
        columnDefinition.title = <span>{metric.name}<TooltipWrapper
          text={() => (<div dangerouslySetInnerHTML={{ __html: metric.tooltip }}></div>)}
          children={undefined}></TooltipWrapper></span>
      }

      columnsDefinitions.push(columnDefinition);
    });

    setColumns(columnsDefinitions);
  };

  useEffect(() => {
    setDefaultColumns(columns);

    GetCoingeckoCategories().then((res: any) => {
      setAllCategories(res);
    });
  }, []);

  useEffect(() => {
    setColumnDefinitions();

    if (tabValue === "All Coins") {
      setSelectedOption(freeDefaults);
      setRiskMetricsEnabled(0);
      setCombinedData(coinData);
    }
    if (tabValue === "Market Analytics") {
      setSelectedOption(proDefaults);
      setRiskMetricsEnabled(1);
      setCombinedData(coinData);
    }
  }, [
    coinData,
    selectedOption,
    tabValue,
    perPage
  ]);

  useEffect(() => {
    if (columns && columns.length) {
      let col: any = [columns[0], columns[1]];
      selectedOption.forEach((option: any) => {
        columns.forEach((column: any) => {
          if (column.key === option) col.push(column);
        });
      });

      setDefaultColumns(col);
    }
  }, [
    coinData,
    selectedOption,
    columns,
    columns.length
  ]);

  return combinedData !== null && coinData !== undefined ? (
    <div className="combine-table-search">
      <DashboardHeader
        setCombinedData={setCombinedData}
        metricsLength={tabValue === 'All Coins' ? freeDefaults.length : proDefaults.length}
        freeDefaults={freeDefaults}
        setFreeDefaults={setFreeDefaults}
        proDefaults={proDefaults}
        setProDefaults={setProDefaults}
        coinData={coinData}
        allCategories={allCategories}
        setSelectedOption={setSelectedOption}
        tabValue={tabValue}
        setTabValue={setTabValue}
        metrics={metrics}
        minMarketCap={minMarketCap}
        setMinMarketCap={setMinMarketCap}
        maxMarketCap={maxMarketCap}
        setMaxMarketCap={setMaxMarketCap}
        minVolume={minVolume}
        setMinVolume={setMinVolume}
        maxVolume={maxVolume}
        setMaxVolume={setMaxVolume}
        volume={volume}
        setVolume={setVolume}
        marketCap={marketCap}
        setMarketCap={setMarketCap}
        setCategory={setCategory}
        currentPlanOfCustomer={currentPlanOfCustomer}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        customerData={customerData}
        setRiskMetricsEnabled={setRiskMetricsEnabled}
        subStatus={subStatus}
        getSubDetailOfCustomer={getSubDetailOfCustomer} />

      {loader === true ?
        <Spin
          style={{padding: "10%", display: 'flex', width: "100%", justifyContent: 'center'}} /> :
        <Table
          className="responsive-table"
          showSorterTooltip={false}
          style={{cursor: 'pointer'}}
          columns={defaultColumns}
          dataSource={coinData}
          pagination={{pageSize: perPage}}
          scroll={{
            x: tabValue === 'Market Analytics' ? 1510 : 1510,
            y: tabValue === 'Market Analytics' ? '100%' : '100%'
          }} />
       }
    </div>
  ) : (
    <Row style={{width: "100%", height: "987px"}}>
      <Spin style={{padding: "10%", display: 'flex', width: "100%", justifyContent: 'center'}} />
    </Row>
  );
};


