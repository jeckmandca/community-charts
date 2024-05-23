import { Layout, Modal } from "antd";

import { useEffect, useState } from "react";
import {Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "./App.css";
import "./blog/Blog.css";

import { getSubscription } from "../services/StripeService";
import { AppHeader } from "./AppHeader";
import { Dashboard } from "./dashboard/Dashboard";
import { Blog } from "./blog/Blog";
import { IndividualPost } from "./blog/IndividualPost";
import { IndividualVideo } from "./media/IndividualVideo";
import { InlineStylesModel } from "../models/InlineStyleModel";
import { Media } from "./media/Media";
import { WorkbenchWrapper } from "./workbench/WorkbenchWrapper";
import { TermsAndConditions } from "./terms/TermsAndConditions";
import { Privacy } from "./terms/Privacy";
import { WorkbenchTutorial } from "./workbench/tutorial/WorkbenchTutorial";
import { Account } from "./account/Account";

require('dotenv').config();

const { Header, Content } = Layout;
const { info } = Modal;

const styles: InlineStylesModel = {
  contentContainer: {
    backgroundColor: "#0A0B0E",
    width: "100vw",
    margin: "auto",
    minHeight: "85vh"
  },

  header: {
    width: "100vw",
    backgroundColor: "#0A0B0E",
    borderBottom: "1px solid rgba(164,164,164,.35)",
    maxWidth: "100%"
  },

  sider: {
    borderRight: "1px solid rgba(164,164,164,.35)",
    backgroundColor: "#0a0c12"
  },

  footerContainer: {
    backgroundColor: "#000000",
    minHeight: "30vh",
    padding: "40px 0px",
    marginTop: "20px"
  }
};

export const App = () => {
  const channelTabs = ["Daily Crypto Analysis", "Upside Down Data"];

  const { user, error, logout, getIdTokenClaims } = useAuth0();
  const [searchParams] = useSearchParams();
  let location = useLocation();

  const [activeTab, setActiveTab] = useState<any>('0');
  const [currentPlanOfCustomer, setCurrentPlanOfCustomer] = useState('free');
  const [subStatus, setSubStatus] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [getSubDetailOfCustomer, setSubDetailOfCustomer] = useState();

  // handle unauthorized error
  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized' &&
      searchParams.get('error_description') === 'Please verify your email before logging in.') {
      info({
        content: (
          <div>
            <p>Activation Email sent!</p>
            {searchParams.get('error_description')}
          </div>
        ),
        onOk() {
          logout({ returnTo: window.location.origin })
        }
      })
    }
  }, [user, error]);

  // get customer details and subscription status
  useEffect(() => {
    let data: any = {};

    const getCustomerDetails = async () => {
      if (user) {
        data = await getSubscription();

        if (data) {
          setSubStatus(data.status);
          setSubDetailOfCustomer(data);
        }
      }

      setCustomerData(data);

      let currentPlan =
          data?.plan?.nickname && data.status === 'active' ?
          data.plan.nickname :
          'free';

      setCurrentPlanOfCustomer(currentPlan);

      return data;
    }

    if (user) {
      getIdTokenClaims().then((res) => {
        if (res) localStorage.setItem('idToken', res.__raw);
        else localStorage.removeItem('idToken');
        getCustomerDetails();
      });
    }
    else {
      localStorage.removeItem('idToken');
      getCustomerDetails();
    }
  }, [currentPlanOfCustomer, user]);

  return (
    <>
      <Layout style={{backgroundColor: "#0A0B0E"}}>
        <Header style={styles.header}>
          <AppHeader
            channelTabs={channelTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentPlanOfCustomer={currentPlanOfCustomer}
            setCurrentPlanOfCustomer={setCurrentPlanOfCustomer}
            customerData={customerData}
            subStatus={subStatus}
            getSubDetailOfCustomer={getSubDetailOfCustomer} />
        </Header>

        <Layout style={{backgroundColor: "#0A0B0E"}}>
          <Content
            className="lg-table-responsive"
            style={{
              ...styles.contentContainer,
              width: location.pathname === '/' ? '100vw' : '85vw'
          }}>
            <Routes>
              <Route path="/" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/dashboard" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/dashboard/allAssets" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/dashboard/riskMetrics" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/dashboard/allAssets/:category" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/dashboard/riskMetrics/:category" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/dashboard/:category" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/settings" element={<Account currentPlan={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} setSubStatus={setSubStatus} />} />

              <Route path="/settings/billing" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/settings/account" element={<Dashboard currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} subStatus={subStatus} getSubDetailOfCustomer={getSubDetailOfCustomer}/>} />

              <Route path="/risk" element={<WorkbenchWrapper currentPlanOfCustomer={currentPlanOfCustomer} setCurrentPlanOfCustomer={setCurrentPlanOfCustomer} customerData={customerData} getSubDetailOfCustomer={getSubDetailOfCustomer} subStatus={subStatus}/>} />

              <Route path="/blog" element={<Blog />} />

              <Route path="/research/:article?" element={<Blog />} />

              <Route path="/research/p/:postTitle" element={<IndividualPost />} />

              <Route path="/media/:channel?" element={<Media />} />

              <Route path="/media/v/:videoId" element={<IndividualVideo />} />

              <Route path="/terms" element={<TermsAndConditions />} />

              <Route path="/privacy" element={<Privacy />} />

              <Route path="/workbench/tutorial" element={<WorkbenchTutorial />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
