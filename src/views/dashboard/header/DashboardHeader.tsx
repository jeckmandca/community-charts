import { Button, Checkbox, Col, Divider, Dropdown, Input, Menu, Radio, RadioChangeEvent, Row, Select, Space, Typography } from 'antd'
import {CaretDownOutlined, SearchOutlined} from "@ant-design/icons";

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import './DashboardHeader.css';

import { CoinCategories } from './CoinCategories';
import { getDashboardData } from '../../../services/MetricService';

import PricingPopUp from '../../account/pricing/PricingPopUp';
import RenewSubscription from '../../account/subscription/RenewSubscription/RenewSubscription';
import DashboardFilter from "../filters/DashboardFilter";

const DashboardHeader = ({
  setCombinedData,
  metricsLength,
  freeDefaults,
  setFreeDefaults,
  proDefaults,
  setProDefaults,
  coinData,
  allCategories,
  setSelectedOption,
  tabValue,
  setTabValue,
  metrics,
  minMarketCap,
  setMinMarketCap,
  maxMarketCap,
  setMaxMarketCap,
  minVolume,
  setMinVolume,
  maxVolume,
  setMaxVolume,
  volume,
  setVolume,
  marketCap,
  setMarketCap,
  setCategory,
  currentPlanOfCustomer,
  setCurrentPlanOfCustomer,
  customerData,
  setRiskMetricsEnabled,
  subStatus,
  getSubDetailOfCustomer
}: any) => {
  let location = useLocation();
  let navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const allCategoriesList = (allCategories: any) => {
    let categories: any= [];
    allCategories.forEach((category: any)=> {
      categories.push({"key": category.id, "label": category.name});
    });
    return categories;
  };

  const [metricsOpen, setMetricsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tradingOpen, setTradingOpen] = useState(false);
  const [marketCapOpen, setMarketCapOpen] = useState(false);
  const [valueCategory, setValueCategory] = useState('');

  const [isModelOpenPrice, setIsModelOpenPrice] = useState(false);
  const [isModelOpenMarketCap, setIsModelOpenMarketCap] = useState(false);
  const [isModelOpenVolume, setIsModelOpenVolume] = useState(false);

  const [popularCatList, setPopularCatList] = useState(CoinCategories);
  const [allCatList, setAllCatList] = useState(allCategoriesList(allCategories));

  const [categoryLabel, setCategoryLabel] = useState("All Categories");
  const [tradingVolumeLabel, setTradingVolumeLabel] = useState('Sort: Trading Volumes');
  const [marketCapLabel, setMarketCapLabel] = useState('Sort: Market Cap');
  const [isModelOpenRenewDeclined, setModelOpenRenewDeclined] = useState(false);

  // prepare metrics
  let freeMetrics = [];
  let allMetrics = [];
  metrics.allDashboardMetrics.forEach((metric: any) => {
    allMetrics.push({
      label: metric.name,
      value: metric.key,
    });

    if (metric.pro !== true) {
      freeMetrics.push({
        label: metric.name,
        value: metric.key,
      });
    }
  });

  // handle navigation
  if (location.pathname === '/dashboard/riskMetrics') {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.pathname
        }
      });
    }
    else {
      if (currentPlanOfCustomer === 'pro') {
        setRiskMetricsEnabled(1);
        setTabValue("Market Analytics");
      }
      else {
        setRiskMetricsEnabled(0);
        setTabValue("All Coins");
      }
    }
  }
  else if (location.pathname === '/dashboard/allAssets') {
    setRiskMetricsEnabled(0);
    setTabValue("All Coins");
  }
  else {
    setRiskMetricsEnabled(0);
    setTabValue("All Coins");
  }

  // calculate min and max filter values
  useEffect(() => {
    let volumeMin = Math.min.apply(Math, coinData.map((o:any) => o.total_volume));
    let volumeMax = Math.max.apply(Math, coinData.map((o:any) => o.total_volume));
    let marketCapMin = Math.min.apply(Math, coinData.map((o:any) => o.market_cap));
    let marketCapMax = Math.max.apply(Math, coinData.map((o:any) => o.market_cap));

    setMaxVolume(volumeMax);
    setMinVolume(volumeMin);
    setMinMarketCap(marketCapMin);
    setMaxMarketCap(marketCapMax);
  }, [tabValue]);

  // handle tab change
  const onChangeCoinsTab = ({target: {value}}: RadioChangeEvent) => {
    if (value === 'All Coins') {
      setRiskMetricsEnabled(0);
      setCategory('');
      setCategoryLabel("All Categories");
      navigate({pathname: '/dashboard/allAssets'})
    }
    else {
      if (!isAuthenticated) {
        loginWithRedirect({
          appState: {
            returnTo: window.location.pathname
          }
        });
      }
      else {
        if (currentPlanOfCustomer === 'free' &&
          (!subStatus || subStatus === 'canceled')) {
          setIsModelOpenPrice(true);
          setModelOpenRenewDeclined(false);
        }
        else if (currentPlanOfCustomer === 'free' &&
          (subStatus === 'past_due' || subStatus === 'unpaid')) {
          setModelOpenRenewDeclined(true);
          setIsModelOpenPrice(false);
        }
        else {
          setCategory('');
          setCategoryLabel("All Categories");
          setRiskMetricsEnabled(1);
          navigate({pathname: '/dashboard/riskMetrics'});
        }
      }
    }

    setTabValue(value);
  }

  // handle metrics selection
  const selectMetrics = (e: any) => {
    if (e.length >= 10) {
      let ele = e.splice(Math.floor(Math.random() * 10), 1)
      const index = e.indexOf(ele);
      if (index > -1) e.splice(index, 1);

      if (tabValue === 'All Coins') setFreeDefaults(e);
      else setProDefaults(e);
    }
    else if (e.length < 10) {
      if (tabValue === 'All Coins') setFreeDefaults(e);
      else setProDefaults(e);
    }

    document.body.classList.remove('modal-open');
  }

  // handle save metrics
  const handleSaveMetrics = () => {
    if (tabValue === 'All Coins') setSelectedOption([...freeDefaults]);
    else setSelectedOption([...proDefaults]);

    setMetricsOpen(!metricsOpen);
  }

  // toggle metric dropdown
  const showMetricsDrop = () => {
    if (metricsOpen === false) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');

    setMetricsOpen(!metricsOpen);
  }

  // toggle trading volume dropdown
  const showTradingDrop = () => {
    if (tradingOpen === false) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');

    setTradingOpen(!tradingOpen);
  }

  // toggle category dropdown
  const showCategoryDrop = () => {
    if (categoryOpen === false) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');

    setCategoryOpen(!categoryOpen);
  }

  // toggle market cap dropdown
  const showMarketCapDrop = () => {
    if (marketCapOpen === false) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');

    setMarketCapOpen(!marketCapOpen);
  }

  // prepare metrics dropdown
  const metricsDrop = () => (
    <>
      <div style={{maxHeight: '50vh', overflow: 'auto'}}>
        <Checkbox.Group
          style={{color: 'red', backgroundColor: 'black'}}
          options={tabValue === 'All Coins' ? freeMetrics : allMetrics}
          value={tabValue === 'All Coins' ? freeDefaults : proDefaults}
          className='CheckGroup'
          defaultValue={tabValue === 'All Coins' ? freeDefaults : proDefaults}
          onChange={(e) => selectMetrics(e)} />
      </div>

      <Row style={{backgroundColor: '#212128', color: 'white', padding: '5px'}}>
        <Col span={8}>
          <Button
            className="save-button"
            shape='round'
            style={{marginRight: '5px', backgroundColor: '#00bf98'}}
            onClick={() => handleSaveMetrics()}>
            Save
          </Button>
        </Col>

        <Col
          style={{display: 'flex', alignItems: 'center', paddingLeft: '10px'}}
          span={16}>
          {metricsLength} of 9 metrics
        </Col>
      </Row>
    </>
  );

  // prepare category dropdown
  const categorySliderDrop = () => (
    <div style={{padding: '5px'}}>
      <Input
        onChange={(e: any) => handleCategoryChange(e)}
        value={valueCategory}
        placeholder="Search"
        prefix={<SearchOutlined className="site-form-item-icon" />} />

      <div className='category_drop' style={{ maxHeight: '50vh', overflow: 'auto' }}>
        <Typography
          style={{borderBottom: '1px solid grey', color: 'white', paddingTop: '10px'}}>
          Popular Platforms
        </Typography>

        <Menu
          style={{backgroundColor: 'black', color: 'white', borderRight: 'none'}}
          onClick={(e: any) => handleCategoryClick(e, popularCatList)}
          items={popularCatList} />

        <Divider style={{backgroundColor: 'white'}} dashed />

        <Typography style={{ borderBottom: '1px solid grey', color: 'white' }}>
          All Categories
        </Typography>

        <Menu
          style={{ backgroundColor: 'black', color: 'white', borderRight: 'none' }}
          onClick={(e: any) => handleCategoryClick(e, allCatList)}
          items={allCatList} />
      </div>
    </div>
  )

  // handle category change
  const handleCategoryChange = (e: any) => {
    setValueCategory(e.target.value);
    setCategoryLabel(e.target.value);

    if (allCatList) {
      let filteredPopular = CoinCategories.filter((category: any) => {
        return category.key.includes(e.target.value);
      });
      setPopularCatList(filteredPopular);

      let filteredAll = allCategoriesList(allCategories).filter((category: any) => {
        return category.key.includes(e.target.value);
      });
      setAllCatList(filteredAll);
    }

    document.body.classList.remove('modal-open');
  }

  // handle category selection
  const handleCategoryClick = (e: any, allCategories: any) => {
    let selectedCategory = allCategories.map((ele: any) => {
      if (ele.key === e.key) return ele;
    });
    selectedCategory = selectedCategory.filter(Boolean);

    if (e.key === "all-categories") setCategory('');
    else setCategory(e.key);

    setCategoryOpen(!categoryOpen);
    setCategoryLabel(selectedCategory[0].label);

    navigate(
    {pathname: '/dashboard/allAssets'},
    {
      state: {
        category: `${selectedCategory[0].label}`,
        volume,
        marketCap
      }
    });

    document.body.classList.remove('modal-open');
  }

  // remove all filters
  const removeAllFilters = () => {
    setMarketCapLabel(`Sort: Market Cap`);
    setTradingVolumeLabel(`Sort: Trading Volumes`);
    setCategoryLabel("All Categories");

    setMarketCap([]);
    setVolume([]);
    setCategory('');

    if (tabValue === 'All Coins') {
      setFreeDefaults([...freeDefaults]);
      setSelectedOption([...freeDefaults]);
    }
    else {
      setProDefaults([...proDefaults]);
      setSelectedOption([...proDefaults]);
    }

    getDashboardData('', [], []).then((data: any) => {
      setCombinedData(data);
    });
  }

  const coinsTab = [
    {
      label: <div style={{ display: 'flex' }}
                  className='flex-tab btn_mrkt'>Market Analytics</div>,
      value: 'Market Analytics'
    },
    {
      label: 'All Coins',
      value: 'All Coins'
    }
  ];

  const coinsTabPro = [
    {
      label: <div style={{ display: 'flex' }}
                  className='flex-tab btn_mrkt'>Market Analytics<div
        className='pro-btn1'>PRO</div></div>,
      value: 'Market Analytics'
    },
    {
      label: 'All Coins',
      value: 'All Coins'
    }
  ];

  const tradingSliderDrop = () => (<></>);

  const marketCapSliderDrop = () => (<></>);

  const openTradingVolume = () => {
    setIsModelOpenVolume(true);
  }

  const openMarketCap = () => {
    setIsModelOpenMarketCap(true);
  }

  return (
    <>
      <div className='scroller-parent'>
        <Row className='scroller-1'>
          <Col className='multibutton-radio mobil_min' xs={7}>
            <Radio.Group
              className="coinsTab"
              options={currentPlanOfCustomer === 'pro' ? coinsTab : coinsTabPro}
              onChange={onChangeCoinsTab}
              value={tabValue}
              optionType="button"
              buttonStyle="solid" />
          </Col>

          <Col className='button-d-set' xs={3}>
            <Dropdown
              className="optionDrop drop2"
              overlay={() => metricsDrop()}
              trigger={['click']}
              visible={metricsOpen}
              onVisibleChange={showMetricsDrop}>
              <a onClick={e => e.preventDefault()}>
                <Space className='custom-drop-1'>
                  <span className="res-color"></span>
                  <span className="bold-content">Select Metrics</span>
                  <CaretDownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Col>

          <Col className='button-d-set' xs={4}>
            <Dropdown
              className="optionDrop drop2"
              overlay={() => categorySliderDrop()}
              trigger={['click']}
              visible={categoryOpen}
              onVisibleChange={showCategoryDrop}>
              <a onClick={e => e.preventDefault()}>
                <Space className='custom-drop-1'>
                  <span className="res-color"></span>
                  <span className="bold-content">{categoryLabel}</span>
                  <CaretDownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Col>

          <Col className='button-d-set' xs={4}>
            <Dropdown
              className="optionDrop drop2"
              overlay={() => tradingSliderDrop()}
              trigger={['click']}
              visible={tradingOpen}
              onVisibleChange={showTradingDrop}>
              <a onClick={() => openTradingVolume()}>
                <Space className='custom-drop-1'>
                  <span className="res-color"></span>
                  <span className="bold-content">{tradingVolumeLabel}</span>
                  <CaretDownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Col>

          <Col className='button-d-set' xs={4}>
            <Dropdown
              className="optionDrop drop2"
              overlay={() => marketCapSliderDrop()}
              trigger={['click']}
              visible={marketCapOpen}
              onVisibleChange={showMarketCapDrop}>
              <a onClick={() => openMarketCap()}>
                <Space className='custom-drop-1'>
                  <span className="res-color"></span>
                  <span className="bold-content">{marketCapLabel}</span>
                  <CaretDownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Col>

          <Col className='button-d-set' xs={2}>
            <Button
              className='remove-filter'
              onClick={() => removeAllFilters()}>Reset Filters</Button>
          </Col>
        </Row>
      </div>

      <RenewSubscription
        isModelOpenRenewDeclined={isModelOpenRenewDeclined}
        setModelOpenRenewDeclined={setModelOpenRenewDeclined}
        getSubDetailOfCustomer={getSubDetailOfCustomer}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        currentPlanOfCustomer={currentPlanOfCustomer} />

      <PricingPopUp
        isModelOpenPrice={isModelOpenPrice}
        setIsModelOpenPrice={setIsModelOpenPrice}
        setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
        currentPlanOfCustomer={currentPlanOfCustomer}
        customerData={customerData} />

      <DashboardFilter
        isModelOpen={isModelOpenMarketCap}
        setIsModelOpen={setIsModelOpenMarketCap}
        minValue={minMarketCap}
        maxValue={maxMarketCap}
        setValue={setMarketCap}
        setLabel={setMarketCapLabel}
        type={'marketCap'} />

      <DashboardFilter
        isModelOpen={isModelOpenVolume}
        setIsModelOpen={setIsModelOpenVolume}
        minValue={minVolume}
        maxValue={maxVolume}
        setValue={setVolume}
        setLabel={setTradingVolumeLabel}
        type={'volume'} />
    </>
  )
}

export default DashboardHeader
