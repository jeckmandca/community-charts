// file path: c:\user\jerald\desktop\community_frontend\src\components\Workbench\WorkbenchHeader.tsx
import React, { useEffect, useMemo, useReducer, useState } from "react";
import PublishScriptModal from '../../../views/workbench/publishchartmodal/PublishChartModal';
import {
  Button,
  Dropdown,
  Input,
  Menu,
  Modal,
  notification,
  Tooltip,
  Typography
} from "antd";
import {
  CaretDownOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  SaveOutlined,
  ShareAltOutlined // Add this import
} from "@ant-design/icons";
import { NotificationPlacement } from "antd/lib/notification";

import {
  getCharts,
  deleteSingleChart,
  getSingleChart,
  saveCharts,
  updateSingleChart,
  publishCommunityChart, // Add this import
  chartsDataReducer,
  initialState,
  ACTIONS
} from "../../../services/ChartService";

const { confirm } = Modal;

export const WorkbenchHeader = ({
  chartName,
  setChartName,
  chartIsSaved,
  setChartIsSaved,
  user,
  loginWithRedirect,
  currentChartId,
  setCurrentChartId,
  metricData,
  chartOptions,
  chartData,
  createEmptyChart,
  loadChart
}) => {
  const [state, dispatch] = useReducer(chartsDataReducer, initialState);
  const { chartsData } = state;

  const [chartsMenuItems, setChartsMenuItems] = useState<any>([]);
  const [myChartsOpen, setMyChartsOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const Context = React.createContext({ name: "Default" });
  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);
  const [openChartCreate, setOpenChartCreate] = useState<boolean>(false);
  const [chartInput, setChartInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputErrorMsg, setInputErrorMsg] = useState("Please enter a valid input!.");

  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false);

  useEffect(() => {
    dispatch({ type: ACTIONS.CALL_API });

    if (user && user.sub !== undefined) {
      const getAllCharts = async () => {
        let response = await getCharts(user && user.sub);
        dispatch({ type: ACTIONS.SUCCESS, data: response });
        return;
      };
      getAllCharts();
    }
  }, [user]);

  useEffect(() => {
    let chartsArray: any = [];

    if (chartsData) {
      chartsData.forEach((ele: any) => {
        chartsArray.push({
          label: ele.name,
          key: ele.id.toString(),
          disabled: false
        });
      });
    }

    setChartsMenuItems(chartsArray);
  }, [chartsData]);

  const showChartModal = () => {
    setChartInput("");
    setInputError(false);
    setOpenChartCreate(true);
  };

  const handleChartCreateOk = (title: any) => {
    let chartNameExist: any = false;
    chartsMenuItems.map((ele: any, i: any) => {
      if (ele.label === chartInput) {
        chartNameExist = true;
      }
    });

    if (chartInput === "") {
      setInputError(true);
      setInputErrorMsg("Chart must have a valid name!");
    }
    else if (chartNameExist) {
      setInputError(true);
      setInputErrorMsg("That chart name already exists!");
    }
    else {
      chartData.userId = user && user.sub;

      if (title === "Create Chart") {
        if (!chartIsSaved) {
          let confirmed = window.confirm(
            "You have unsaved changes. Are you sure you want to create a new chart?"
          );
          if (!confirmed) {
            return;
          }
        }

        metricData = createEmptyChart();
      }

      let newChartName = chartInput.charAt(0).toUpperCase() + chartInput.slice(1);
      chartData.chartName = newChartName;
      setChartName(newChartName);

      setOpenChartCreate(false);

      let options = {
        type: chartOptions.chart.type,
        yAxis: chartOptions.yAxis
      };

      chartData.metricData = metricData;

      saveCharts(chartData, options).then((res) => {
        setCurrentChartId(res.id);
        setChartsMenuItems([
          ...chartsMenuItems,
          {
            label: res.name,
            key: res.id.toString(),
            disabled: false
          }
        ]);
      });

      setInputError(false);
      setChartIsSaved(true);
    }
  };

  const handleChartCreateCancel = () => {
    setOpenChartCreate(false);
  };

  const handleChartInput = (e: any) => {
    if (e.target.value) setInputError(false);
    setChartInput(e.target.value);
  };

  const handleSaveChart = (placement: NotificationPlacement) => {
    if (chartIsSaved === false) {
      api.info({
        message: `Chart Updated Successfully!`,
        description: "",
        placement,
      });
      updateSingleChart([...metricData], chartOptions, currentChartId);
      setChartIsSaved(true);
    }
  };

  const confirmDeleteChart = () => {
    try {
      if (currentChartId > 0) {
        confirm({
          title: "Do you want to delete this chart?",
          icon: <ExclamationCircleFilled />,
          onOk() {
            deleteSingleChart(currentChartId).then(() => {
              let newArr = chartsMenuItems.filter((res:any) => {
                if (Number(res.key) !== currentChartId) {
                  return res;
                }
              });
              setChartsMenuItems(newArr);

              createEmptyChart();
            });
          },
          onCancel() {}
        });
      }
    }
    catch (e) {
      console.log(e);
    }
  };

  const handleChartSelected = (e: any) => {
    try {
      let chartIndex = e.key;

      chartsMenuItems.filter((res: any, i: any) => {
        if (res.key === chartIndex) {
          setChartName(res.label);
        }
      });

      setMyChartsOpen(false);

      getSingleChart(Number(chartIndex)).then((res) => {
        loadChart(res, chartIndex);
      });
    }
    catch (e) {
      console.log(e);
    }
  };

  const myCharts = () => (
    <>
      <Menu
        className="chart-menu"
        onClick={(e: any) => handleChartSelected(e)}
        items={chartsMenuItems} />
    </>
  );

  const handleMyChartsVisibility = () => {
    setMyChartsOpen(!myChartsOpen);
  };

  const handlePublishChart = async (placement: NotificationPlacement) => {
    if (!chartIsSaved) {
      Modal.confirm({
        title: "Chart must be saved before publishing, do you want to save now?",
        icon: <ExclamationCircleFilled />,
        onOk: async () => {
          handleSaveChart(placement);
          handlePublishChart(placement);
        },
        onCancel() {
          notification.info({
            message: `Publish Cancelled`,
            description: "The chart publish was cancelled by the user.",
            placement,
          });
        },
      });
      return;
    }

    if (currentChartId > 0) {
      try {
        const response = await publishCommunityChart(currentChartId);

        const message = response.data?.message || "Unknown response";

        switch (message) {
          case "Validation Error.":
            notification.error({
              message: `Validation Error`,
              description: "There was a validation error with the request.",
              placement,
            });
            break;
          case "Chart ID is required!":
            notification.error({
              message: `Chart ID Required`,
              description: "The chart ID is required to perform this action.",
              placement,
            });
            break;
          case "Chart not found!":
            notification.error({
              message: `Chart Not Found`,
              description: "The specified chart was not found.",
              placement,
            });
            break;
          case "Chart shared successfully!":
            notification.info({
              message: `Chart Shared Successfully!`,
              description: "",
              placement,
            });
            setChartIsSaved(true);
            break;
          case "Nothing to update":
            notification.info({
              message: `No Changes Detected`,
              description: "The chart is already shared with no updates.",
              placement,
            });
            break;
          case "This chart is already public, do you wish to update it?":
            Modal.confirm({
              title: "This chart is already public, do you wish to update it?",
              icon: <ExclamationCircleFilled />,
              onOk: async () => {
                // Resend the request with confirmation
                const confirmResponse = await publishCommunityChart(currentChartId, true);
                notification.info({
                  message: `Chart Updated Successfully!`,
                  description: "",
                  placement,
                });
                setChartIsSaved(true);
              },
              onCancel() {
                notification.info({
                  message: `Update Cancelled`,
                  description: "The chart update was cancelled by the user.",
                  placement,
                });
              },
            });
            break;
          case "Chart updated successfully!":
            notification.info({
              message: `Chart Updated Successfully!`,
              description: "",
              placement,
            });
            setChartIsSaved(true);
            break;
          case "INTERNAL SERVER ERROR":
            notification.error({
              message: `Internal Server Error`,
              description: "An internal server error occurred.",
              placement,
            });
            break;
          default:
            notification.error({
              message: `Unknown Response`,
              description: "An unknown response was received from the server.",
              placement,
            });
            break;
        }
      } catch (error) {
        notification.error({
          message: `Error Sharing Chart`,
          description: error.message,
          placement,
        });
      }
    } else {
      notification.warning({
        message: `Save the Chart First`,
        description: "You need to save the chart before sharing it.",
        placement,
      });
    }
  };

  const showPublishModal = () => {
    setIsPublishModalVisible(true);
  };
  
  const hidePublishModal = () => {
    setIsPublishModalVisible(false);
  };
  
  return <>
    <div className="ChartLeft">
      <div className="ChartBoxOne">
        <a
          href="https://docs.polaritydigital.io/"
          target="_blank"
          className="button-tutorial">Tutorial</a>

        <p>{chartName}</p>

        {chartIsSaved === false && (
          <p
            style={{
              backgroundColor: "rgb(255, 245, 224)",
              color: "rgb(171, 87, 10)",
              fontSize: "0.75rem",
              padding: "0px 4px"
            }}>
            Not Saved
          </p>
        )}
      </div>
    </div>

    <div className="ChartRight">
      <div className="ChartBoxOne">

        <Tooltip placement="bottom" title={"Open Publish Modal"}>
          <Button type="text" onClick={showPublishModal}>
            Test Publish Modal
          </Button>
        </Tooltip>

        <PublishScriptModal
          visible={isPublishModalVisible}
          onClose={hidePublishModal}
        />

        <Dropdown
          overlay={() => myCharts()}
          visible={myChartsOpen}
          trigger={["click"]}
          onVisibleChange={handleMyChartsVisibility}>
          <a onClick={(e) => e.preventDefault()}>
            <p className="myCharts ant-btn ant-btn-text">
              <span>My Charts</span>
              <CaretDownOutlined />
            </p>
          </a>
        </Dropdown>


        <Button
          type="text"
          onClick={() =>
            user === undefined || user.sub === undefined
              ? loginWithRedirect({
                appState: {
                  returnTo: window.location.pathname,
                  metricData,
                  chartOptions,
                  chartIsSaved
                }
              })
              : showChartModal()
          }>
          {currentChartId === 0 ? "Save Chart" : "Create Chart"}
          <PlusOutlined />
        </Button>

        <Modal
          title={currentChartId === 0 ? "Save Chart" : "Create Chart"}
          visible={openChartCreate}
          onOk={() =>
            handleChartCreateOk(
              currentChartId === 0 ? "Save Chart" : "Create Chart"
            )
          }
          onCancel={handleChartCreateCancel}>
          <Typography style={{color: "white", marginBottom: "14px"}}>
            Chart Name
          </Typography>

          <Input
            placeholder="Enter Chart Name"
            value={chartInput}
            onChange={(e) => handleChartInput(e)} />

          {inputError && (
            <Typography style={{color: "red"}}>
              {inputErrorMsg}
            </Typography>
          )}
        </Modal>

        <Context.Provider value={contextValue}>
          {contextHolder}

          <Tooltip placement="bottom" title={"Save Chart"}>
            <Button
              type="text"
              onClick={() =>
                currentChartId > 0
                  ? handleSaveChart("topRight")
                  : user === undefined || user.sub === undefined
                    ? loginWithRedirect({
                      appState: {
                        returnTo: window.location.pathname,
                        metricData
                      }
                    })
                    : showChartModal()}>
              <SaveOutlined />
            </Button>
          </Tooltip>

          {currentChartId > 0 && chartIsSaved && (
            <>
              <Tooltip placement="bottom" title={"Delete Chart"}>
                <Button type="text" onClick={(e) => confirmDeleteChart()}>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
              <Tooltip placement="bottom" title={"Share Chart"}>
                <Button type="text" onClick={() => handlePublishChart("topRight")}>
                  <ShareAltOutlined />
                </Button>
              </Tooltip>
            </>
          )}
        </Context.Provider>
      </div>
    </div>
  </>
}
