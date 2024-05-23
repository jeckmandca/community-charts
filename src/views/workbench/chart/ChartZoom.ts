import Highcharts from "highcharts/highstock";

const chartZoom = () => {
  if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    Highcharts.Chart.prototype['callbacks'].push(function (chart: any) {
      Highcharts.addEvent(chart.container, "wheel", function (e: any) {
        const wheelEvent = e as WheelEvent;

        if (chart.pointer.inClass(wheelEvent.target, "highcharts-container")) {
          let xAxis = chart.xAxis[0];
          let extremes = xAxis.getExtremes();

          // calculate the zoom factor
          let zoomFactor = 1 - (extremes.min - xAxis.dataMin) / (xAxis.dataMax - xAxis.dataMin);
          let zoomFactorNew = zoomFactor > 1 ? 1 : zoomFactor;
          let zoomFactorUltimate = xAxis.dataMin < 0 && zoomFactorNew < 0.1 ? 0.05 : zoomFactorNew;

          // introduce an additional tiered zoom multiplier in order to
          // scale zoom levels as the length of the data increases
          let zoomMultiplier = 2;
          if (zoomFactorUltimate < 0.75 && zoomFactorUltimate >= 0.45)
            zoomMultiplier = 3;
          else if (zoomFactorUltimate < 0.45 && zoomFactorUltimate >= 0.25)
            zoomMultiplier = 6;
          else if (zoomFactorUltimate < 0.25 && zoomFactorUltimate >= 0.15)
            zoomMultiplier = 12;
          else if (zoomFactorUltimate < 0.15 && zoomFactorUltimate >= 0.1)
            zoomMultiplier = 30;
          else if (zoomFactorUltimate < 0.1)
            zoomMultiplier = 60;

          // calculate new extremes
          let newMax = xAxis.max;
          if (extremes.max / xAxis.dataMax < 0.97)
            newMax = xAxis.dataMax * (extremes.max / xAxis.dataMax + 0.03);
          else if (xAxis.max / xAxis.dataMax >= 0.97)
            newMax = xAxis.dataMax * 1;

          let newMin = Math.max(
            xAxis.dataMin,
            extremes.min -
            zoomFactor * zoomMultiplier * (extremes.max - extremes.min) * 0.33
          );

          // set new extremes
          if (wheelEvent.deltaY > 0 &&
            extremes.min === xAxis.dataMin &&
            xAxis.max / xAxis.dataMax < 0.998) {
            xAxis.setExtremes(newMin, newMax, true);
            wheelEvent.preventDefault();
          }
          else {
            if (wheelEvent.deltaY > 0) {
              xAxis.setExtremes(newMin, extremes.max, true);
            }
            else {
              if ((xAxis.max - xAxis.min) >= 0.01 * xAxis.dataMax) {
                newMin = extremes.min +
                  zoomFactorUltimate *
                  zoomMultiplier *
                  (extremes.max - extremes.min) *
                  0.1;

                xAxis.setExtremes(newMin, extremes.max, true);
              }
            }

            wheelEvent.preventDefault();
          }
        }
      });
    });
  }
}

export default chartZoom
