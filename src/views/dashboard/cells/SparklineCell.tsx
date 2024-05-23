import Sparkline, {Tooltip} from 'devextreme-react/sparkline';
import React from "react";

interface PropTypes {
  data: any[]
}

const SparklineCell: React.FC<PropTypes> = ({ data }: any) => {
  let dataSource = [];

  if (data.sparkline_in_7d) {
    try {
      let parsedData = JSON.parse(data.sparkline_in_7d);
      dataSource = parsedData.price;
    }
    catch(e) {}
  }

  return (
    <>
      <Sparkline
        dataSource={dataSource}
        className="sparkline"
        lineColor="green"
        argumentField="month"
        valueField={'2010'}
        showFirstLast={false}
        type="spline">
        <Tooltip format="currency" />
      </Sparkline>
    </>
  );
}

export default SparklineCell;

