import { Button, Col, Drawer, Dropdown, Menu, Modal, Row, Space, Typography } from "antd";
import { CloseOutlined, BarsOutlined, CaretDownOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// @ts-ignore
import { ReactComponent as YoutubeDCA } from '../images/socials/1.svg';
// @ts-ignore
import { ReactComponent as YoutubeUDD } from "../images/socials/2.svg";
// @ts-ignore
import { ReactComponent as TwiterDCA } from "../images/socials/3.svg";
// @ts-ignore
import { ReactComponent as TwiterUDD } from "../images/socials/4.svg";
// @ts-ignore
import { ReactComponent as DiscordSVG } from "../images/socials/5.svg";
// @ts-ignore
import NewLogo from '../images/logo.png'

import "./AppHeader.css"
import { InlineStylesModel } from "../models/InlineStyleModel";

import PricingPopUp from "./account/pricing/PricingPopUp";
import RenewSubscription from "./account/subscription/RenewSubscription/RenewSubscription";
import { HeaderMenu } from "./HeaderMenu";

const styles: InlineStylesModel = {
  rowContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    flexWrap: "nowrap"
  }
};

export const AppHeader = ({
  channelTabs,
  activeTab,
  setActiveTab,
  currentPlanOfCustomer,
  setCurrentPlanOfCustomer,
  customerData,
  subStatus,
  getSubDetailOfCustomer
}: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {user, isAuthenticated, loginWithRedirect, logout} = useAuth0();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isModelOpenPrice, setIsModelOpenPrice] = useState(false);
  const [isModelOpenRenewDeclined, setModelOpenRenewDeclined] = useState(false);
  const [windowSize, setWindowSize] = useState(getWindowSize());

  let pathName = location.pathname;

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  const showDrawer = () => {
    setMenuOpen(true);
  };

  const onClose = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handlePricing = () => {
    setMenuOpen(false);
    setIsModelOpenPrice(true);

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
  }

  const handlePRORoute = (path: any) => {
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
        navigate(path);
      }
    }
  }

  const handleProfile = (e: any) => {
    setMenuOpen(false);

    if (e.key === '1') {
      navigate('/settings', {
        state: {
          currentPlan: currentPlanOfCustomer,
          customerData: customerData,
          activeTab: 'Account'
        }
      });
    }
  }

  const userMenu = () => (
    <div>
      <Menu
        className="borderRightNone"
        onClick={(e: any) => handleProfile(e)}
        items={[
          {
            label: 'User Account',
            key: "1"
          }
        ]} />
    </div>
  );

  return (
    <>
      <Row style={styles.rowContainer} align="middle">
        <Col className="drawerIcon">
          {menuOpen ?
            <CloseOutlined className="icon-svg" onClick={onClose} /> :
            <BarsOutlined className="icon-svg" onClick={showDrawer} />}
        </Col>

        <Col className="logo-mobile" style={{ height: "70px", lineHeight: '156px' }}>
          <Link to="/" style={{ height: '100%' }}>
            <img src={NewLogo} alt="not found" height={50} />
          </Link>
        </Col>

        <Col style={{zIndex: 999}}>
          <HeaderMenu
            channelTabs={channelTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentPlanOfCustomer={currentPlanOfCustomer} />
        </Col>

        <Col className="logout-section">
          {windowSize.innerWidth < 820 ?
            (<Button></Button>)
            : (
              <>
                <Button className="lg-btn" onClick={() => handlePricing()}>
                  Pricing
                </Button>

                {isAuthenticated ? (
                  <Space>
                    <Dropdown
                      overlay={() => userMenu()}
                      trigger={['click']}>
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          {user && user.nickname}
                          <CaretDownOutlined />
                        </Space>
                      </a>
                    </Dropdown>

                    <img
                      src={user?.picture}
                      style={{ width: 35, height: 35, borderRadius: "50%" }}
                      alt={''} />

                    <Button
                      className="lg-btn"
                      onClick={() => logout({ returnTo: window.location.origin })}>
                      Log out
                    </Button>
                  </Space>
                ) : (
                  <Space>
                    <Button
                      onClick={() =>
                        loginWithRedirect({
                          appState: {
                            returnTo: window.location.pathname
                          }
                        })
                      }
                      className="lg-btn">Login</Button>

                    <Button
                      onClick={() =>
                        loginWithRedirect({
                          screen_hint: 'signup',
                          appState: {
                            returnTo: window.location.pathname
                          }
                        })
                      }
                      className="sign-btn">Sign Up</Button>
                  </Space>
                )}
              </>)}
        </Col>
      </Row>

      <Drawer className="custom-sidebar"
        placement={'left'}
        closable={false}
        onClose={onClose}
        visible={menuOpen}
        key={'left'}>
        <div className="sidebar-menu">
          <h6>
            <p style={{ padding: 0 }}>
              {windowSize.innerWidth < 820 && <>
                {isAuthenticated ? (
                  <span>
                    <Typography
                      className="sideBarBorder"
                      style={{ color: '#fff' }}> <img
                      alt={''}
                      src={user?.picture}
                      style={{ width: 35, height: 35, borderRadius: "50%", marginRight: '10px' }} />

                      <Dropdown
                        overlay={() => userMenu()}
                        trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                          <Space className="fontSi">
                            {user && user.nickname}
                            <CaretDownOutlined />
                          </Space>
                        </a>
                      </Dropdown>

                      <Button
                        className="lg-btn mt-10 logOutBorder"
                        onClick={() => logout({ returnTo: window.location.origin })}>
                        Log out
                      </Button>
                    </Typography>

                    <Link to="#" className="pricing" onClick={() => handlePricing()}>
                      Pricing
                    </Link>
                  </span>
                ) : (
                  <>
                    <Space>
                      <Button
                        onClick={() =>
                          loginWithRedirect({
                            appState: {
                              returnTo: window.location.pathname
                            }
                          })
                        }
                        className="lg-btn logOutBorder">Login</Button>

                      <Button
                        onClick={() =>
                          loginWithRedirect({
                            screen_hint: 'signup',
                            appState: {
                              returnTo: window.location.pathname
                            }
                          })
                        }
                        className="lg-btn logOutBorder">Sign Up</Button>
                    </Space>

                    <Link
                      to="#"
                      className="pricing"
                      style={{ fontSize: "17px" }}
                      onClick={() => handlePricing()}>
                      Pricing
                    </Link>
                  </>
                )}
              </>
              }
            </p>

            <p style={{ padding: 0 }} onClick={onClose}>
              <Link style={{ fontSize: "17px", padding: 0, color: pathName === '/' ? '#13f3c9' : '#fff' }} to={'/'}>Dashboard</Link>
            </p>
          </h6>

          <p onClick={onClose}>
            <Link style={{ color: pathName === '/dashboard/allAssets' ? '#13f3c9' : '#677d80' }} to={'/dashboard/allAssets'}>All Assets</Link>
          </p>

          <p onClick={onClose}>
            <a style={{ color: pathName === '/dashboard/riskMetrics' ? '#13f3c9' : '#677d80', display: 'flex' }}
               onClick={() => handlePRORoute('/dashboard/riskMetrics')}>Market Analytics
              {currentPlanOfCustomer === 'free' && <div className='pro-btn'>PRO</div>}</a>
          </p>
        </div>

        <div className="sidebar-menu-single">
          <p onClick={onClose}>
            <Link style={{ color: pathName === '/risk' ? '#13f3c9' : '#fff' }} to={'/risk'}>Workbench</Link>
          </p>
        </div>

        <div className="sidebar-menu">
          <h6>
            <p style={{ padding: 0 }} onClick={onClose}>
              <a style={{ fontSize: "17px", padding: 0, color: pathName === '/research' ? '#13f3c9' : '#fff' }}
                 onClick={() => handlePRORoute('/research')}>Research
                {currentPlanOfCustomer === 'free' && <div className='pro-btn'>PRO</div>}</a>
            </p>
          </h6>
        </div>

        <div className="sidebar-menu">
          <h6>
            <p style={{ padding: 0 }} onClick={onClose}>
              <Link style={{ color: pathName === '/media' ? '#13f3c9' : '#fff', fontSize: "17px", padding: 0 }} to={'/media'}>Videos</Link>
            </p>
          </h6>

          <p onClick={onClose}>
            <Link style={{ color: pathName === '/media/latest' ? '#13f3c9' : '#677d80' }} to={'/media/latest'}>Latest</Link>
          </p>

          <p onClick={onClose}>
            <Link style={{ color: pathName === '/media/dailyanalysis' ? '#13f3c9' : '#677d80' }} to={'/media/dailyanalysis'}>Daily Crypto Analysis</Link>
          </p>

          <p onClick={onClose}>
            <Link style={{ color: pathName === '/media/upsidedowndata' ? '#13f3c9' : '#677d80' }} to={'/media/upsidedowndata'}>Upside Down Data</Link>
          </p>

          <p onClick={onClose}>
            <Link style={{ color: pathName === '/media/investoreducation' ? '#13f3c9' : '#677d80' }} to={'/media/investoreducation'}>Investor Education</Link>
          </p>

          <p onClick={onClose}>
            <Link style={{ color: pathName === '/research/defi' ? '#13f3c9' : '#677d80', display: 'flex' }} to=''
                  onClick={() => handlePRORoute('/research/defi')}>Pro Videos
              {currentPlanOfCustomer === 'free' && <div className='pro-btn'>PRO</div>}</Link>
          </p>
        </div>

        <div className='sidbar-footer'>
          <div className='social-media-icon'>
            <Link to={'https://www.youtube.com/c/DailyCryptoAnalysisYT'}><YoutubeDCA /></Link>
            <Link to={'https://www.youtube.com/c/DailyCryptoAnalysisYT'}><YoutubeUDD /></Link>
            <Link to={'https://twitter.com/Jay_DCA'}><TwiterDCA /></Link>
            <Link to={'https://twitter.com/upsidedowndata'}><TwiterUDD /></Link>
            <Link to={'https://discord.gg/9BYCcAH5Xp'}><DiscordSVG /></Link>
          </div>

          <div className='page-link'>
            <p onClick={onClose}>
              <Link to={'/terms'}>Terms & Conditions</Link>
            </p>

            <Link className='page-dot' to={'#'}></Link>

            <p onClick={onClose}>
              <Link to={'privacy'}>Privacy Policy</Link>
            </p>

            <p className='reserved-p'>© 2024 Polarity Digital Inc. All rights reserved.</p>

            <p className='reserved-p'>Powered by CoinGecko</p>

            <p className='reserved-p'>This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.</p>

            <p className='contact-p'>Contact us: support@PolarityDigital.io</p>
          </div>
        </div>
      </Drawer>

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
    </>
  );
};
