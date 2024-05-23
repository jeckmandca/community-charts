import {Button, Select} from "antd";

import { InlineStylesModel } from "../../../models/InlineStyleModel";

const styles: InlineStylesModel = {
  metricSelectorStyle: {
    color: "white",
    fontSize: "14px",
    marginBottom: "0em",
    fontWeight: 400,
    cursor: "pointer",
    width: "100%"
  }
};

export const getMetricOptions = ({
  selectedButton,
  selectedCrypto,
  currentPlanOfCustomer,
  handleUpgrade,
  metrics,
  series
}:any) => {
  let optionGroups:any = [];
  let groups:any = {};

  // prepare cryptocurrency metric groups
  if (selectedButton === "cryptocurrency") {
    let coinMetrics = metrics.allWorkbenchMetrics;
    if (!selectedCrypto) return;

    coinMetrics.forEach((item:any) => {
      if (!item.coins.includes(selectedCrypto.symbol)) return;
      if (item.source === 'santiment') {
        let missingCoins = item.santiment_missing_coins;
        if (missingCoins) missingCoins = missingCoins.split(',');
        if (missingCoins && missingCoins.includes(selectedCrypto.symbol)) return;
      }

      let group = item.category;
      let itemData = {
        value: item.key,
        label: item.name,
        pro: item.pro
      };

      if (groups[group]) groups[group].push(itemData);
      else groups[group] = [itemData];
    });
  }

  // prepare economic and indexes metric groups
  let seriesData = [];
  if (selectedButton === "economic") seriesData = series.economicSeries;
  if (selectedButton === "indexes") seriesData = series.indexesSeries;
  if (selectedButton === "economic" || selectedButton === "indexes") {
    seriesData.forEach((item:any) => {
      let group = item.category;
      let itemData = {
        value: item.series_id,
        label: item.name
      };

      if (groups[group]) groups[group].push(itemData);
      else groups[group] = [itemData];
    });
  }

  // prepare options
  Object.keys(groups).forEach((group) => {
    let options:any = [];

    groups[group].forEach((item:any) => {
      if (currentPlanOfCustomer === 'free' && item.pro) {
        options.push(
          <Select.Option
            className='option-disable'
            style={styles.DisableOption}
            value={item.value}
            key={item.value}
            disabled>
              {item.label}
              <Button
                className="button-right"
                onClick={(e) => handleUpgrade(e)}>Upgrade</Button>
          </Select.Option>
        );
      }
      else {
        options.push(
          <Select.Option
            className='option-disable'
            style={styles.DisableOption}
            value={item.value}
            key={item.value}>
              {item.label}
          </Select.Option>
        );
      }
    });

    optionGroups.push(
      <Select.OptGroup style={styles.selectOptionHeader} label={group} key={group}>
        {options}
      </Select.OptGroup>
    );
  });

  return optionGroups;
};
