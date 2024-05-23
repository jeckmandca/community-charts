import {formatTooltipValues} from "../../../utils/metricsFormatting";
import {formatDate} from "../../../utils/metricsFormatting";

  export let ChartConfig = (
  chartProps: any,
  handleMetricVisibilityChange: any
  ) => {
  const HeightAdjustor = () => {
      return '75%'; // Always use 100% of the div's height
  };

  return {
    time: {
      timezone: "Europe/London",
      useUTC: true
    },
    boost: {
      enabled: false
    },
    tooltip: {
      formatter: function () {
        let points: any;
        points = this.points;

        let metricIndices = window['metricIndices'];
        let metricItems = window['metricItems'];

        // Order points in the same order as in metricData, based on metric ID
        points.sort((a: any, b: any) => {
          return metricIndices.get(a.series.options.id) - metricIndices.get(b.series.options.id);
        });

        return points.reduce(function (s: any, point: any) {
          let metricItem = metricItems.get(point.series.options.id);
          let metricKey = metricItem.selectedMetric;
          let metricItemData = chartProps.metricsKeyMap[metricKey];
          let metricName = metricItemData?.name || point.series.name;
          let coinName = (metricItem?.selectedCrypto?.symbol || "").toUpperCase();

          let formattedValue = formatTooltipValues(
            chartProps.metricsKeyMap,
            metricKey,
            point.y
          );

          return `${s} <br/> <b style="color: ${point.color}; font-size: 20px;">●</b>
              <p>${coinName}</p>${coinName ? ": " : ""}
              <p>${metricName}</p>: <p>${formattedValue}</p>`;
        },
        '<span style="font-size: 12px;">' +
        formatDate(new Date(this.x).toUTCString()) + " UTC" +
        "</span>");
      },
      strokeWidth: "0.5px",
      borderRadius: 8,
      followPointer: true,
      distance: 60,
      split: false,
      shared: true,
      panning: true,
      backgroundColor: "rgba(0,0,0, .85)",
      borderWidth: 4,
      borderShadow: true,
      shadow: true,
      stickOnContact: false,
      hideDelay: 2000,
      padding: 5,
      style: {
        color: "#fff",
        cursor: "default",
        fontSize: "12px",
        whiteSpace: "nowrap"
      }
    },
    chart: {
      alignThresholds: false,
      panning: {
        enabled: true,
        type: "x"
      },
      events: {
        load: function () {
          this.renderTo.style.cursor = 'url(\'cursor.svg\') 8 8, auto';
        },
        redraw: function () {
          // console.log("%c Chart redraw", "color: #ff8c00");
        }
      },
      defaultSeriesType: "line",
      ignoreHiddenSeries: true,
      spacing: [0, 10, 0, 10],
      borderColor: "#335cad",
      plotBorderColor: "#cccccc",
      backgroundColor: "rgba(0, 0, 0,0.75)",
      zoomBySingleTouch: false,
      animation: false,
      zooming: {
        wheel: true,
        type: "x"
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: true,
      align: "left",
      alignColumns: true,
      layout: "horizontal",
      borderColor: "#ffffff",
      borderRadius: 1,
      itemStyle: {
        color: "#fff",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "bold",
        textOverflow: "ellipsis"
      },
      itemHoverStyle: {
        color: "#fff"
      },
      itemHiddenStyle: {
        color: "grey"
      },
      itemCheckboxStyle: {
        position: "absolute",
        width: "5px",
        height: "13px"
      },
      squareSymbol: true,
      symbolPadding: 5,
      symbolRadius: 0,
      verticalAlign: "bottom",
      x: 65,
      y: 0,
      title: {
        style: {
          fontWeight: "bold"
        }
      }
    },
    navigator: {
      maskFill: "rgba(60,65,76,0.3)",
      maskInside: true,
      outlineColor: "rgba(255,255,255,0.2)",
      outlineWidth: 1,
      overscroll: false,
      height: window.innerWidth <= 1000 && window.innerHeight <= 800 ? 30 : 25,
      handles: {
        backgroundColor: "#000000d9",
        width: window.innerWidth <= 1000 && window.innerHeight <= 800 ? 20 : 15,
        height: window.innerWidth <= 1000 && window.innerHeight <= 800 ? 25 : 25
      },
      xAxis: {
        dateTimeLabelFormats: {
          day: "%e of %b"
        }
      }
    },
    lang: {
      numericSymbols: ["K", "M", "B", "T", "P", "E"],
      rangeSelectorZoom: ""
    },
    yAxis: {
      labels: {
        style: {
          fontSize: '14px', // Adjust font size here as needed
          color: '#666' // Optional: change the font color
        }
      }
    },
    xAxis: {
      startOnTick: false,
      endOnTick: false,
      offset: 0,
      dateTimeLabelFormats: {
        day: "%e of %b"
      },
      crosshair: {
        enabled: true,
        snap: false,
        width: "0.03rem",
        color: "#555"
      },
      panningEnabled: true,
      zoomEnabled: true,
      minorGridLineDashStyle: "Solid",
      minorTickLength: 2,
      minorTickPosition: "outside",
      showFirstLabel: true,
      showLastLabel: true,
      startOfWeek: 1,
      tickLength: 10,
      tickPixelInterval: 150,
      tickmarkPlacement: "between",
      tickPosition: "outside",
      title: {
        align: "middle",
        style: {
          color: "#666666"
        }
      },
      minorGridLineColor: "#f2f2f2",
      minorGridLineWidth: 1,
      minorTickColor: "#999999",
      lineColor: "#ccd6eb",
      lineWidth: 1,
      gridLineColor: "#e6e6e6",
      tickColor: "#ccd6eb",
      labels: {
        style: {
          color: '#FFF', // Set the color of the axis labels
          fontSize: '13px' // Set the font size of the axis labels
        }
      },
      events: {
        afterSetExtremes: () => {
          // commenting this out for now as it's slowing down performance
          /*console.log("after set extremes");
          let chart_navigator = chart?.current?.chart;
          let graphSize = chart_navigator.plotWidth;
          chart_navigator.navigator.size = graphSize;
          chart_navigator.navigator.xAxis.lineWidth = graphSize;
          chart_navigator.navigator.xAxis.gridLineWidth = graphSize;*/
        }
      }
    },
    scrollbar: {
      enabled: false
    },
    loading: {
      labelStyle: {
        fontWeight: "bold",
        position: "relative",
        top: "45%"
      },
      style: {
        position: "absolute",
        backgroundColor: "#ffffff",
        opacity: 0.5,
        textAlign: "center"
      }
    },
    plotOptions: {
      series: {
        turboThreshold: 1,
        lineWidth: 2,
        boostThreshold: 1,
        animation: false,
        delay: 0,
        showInNavigator: true,
        connectNulls: false,
        enableMouseTracking: true,
        states: {
          inactive: {
            enabled: false
          },
          hover: {
            lineWidth: 2
          }
        },
        dataGrouping: {
          enabled: true,
          groupPixelWidth: 1,
          approximation: "average"
        },
        marker: {
          symbol: "circle",
          radius: 1,
          hideDelay: 0
        },
        groupPadding: 0,
        events: {
          hide: handleMetricVisibilityChange,
          show: handleMetricVisibilityChange
        }
      }
    },
    responsive: {
      rules: [
        {
          condition: {
            maxHeight: "100%"
          }
        }
      ]
    },
    rangeSelector: {
      selected: undefined,
      buttonTheme: {
        style: {
          display: "none"
        }
      },
      inputEnabled: false
    },
    stockTools: {
      gui: {
        enabled: false
      }
    }
  }
}
