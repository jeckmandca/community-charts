import { Typography } from 'antd';

// @ts-ignore
import formulaImg from "../../../images/tutorial/formulas.png";
// @ts-ignore
import metrics from "../../../images/tutorial/metrics.png";
// @ts-ignore
import percentage from "../../../images/tutorial/percentage.png";
// @ts-ignore
import percentagechange from "../../../images/tutorial/percentageformula.png";
// @ts-ignore
import metricschange from "../../../images/tutorial/metricschange.png";
// @ts-ignore
import percentageDays from "../../../images/tutorial/percentageDays.png"

import './WorkbenchTutorial.css';

const { Title, Paragraph } = Typography;

export const WorkbenchTutorial = () => {
  return (
    <div className="terms-condition">
      <Paragraph>The Polarity Digital Workbench is currently in the alpha phase of development. Please expect to
        encounter various bugs and crashes as we continue to develop this tool.</Paragraph>

      <Paragraph>The Polarity Digital Workbench is a dynamic tool which provides an easy, no-code, method to expand your
        analysis of the cryptocurrency market to new heights. This tool will allow the user to analyze and create a wide
        range of indicators and risk models on a single chart.</Paragraph>

      <br/>

      <Title level={4}>How to use the Workbench:</Title>

      <br/><br/>

      <Title level={4}>Add+:</Title>

      <Paragraph>Metric: Allows you to add as many metrics to the chart as you would like, currently this is limited to
        the risk metric assets, however this will be expanded to a broad number of cryptocurrency assets and economic
        indicators in the coming weeks.</Paragraph>

      <Paragraph>Formula: Allows you to create custom metrics, without the need for coding knowledge as would be
        required in TradingView, etc. You can add as many metrics to the chart as you would like. Once entered, hit
        “Evaluate and draw” button, and the formula will be added to the chart.</Paragraph>

      <Paragraph>Price: A simple way to quickly add the price of Bitcoin to the chart.</Paragraph>

      <br/><br/>

      <Title level={4}>Metrics and Formuls:</Title>

      <Paragraph>Metric (m1…): The metric will be displayed in the top bar of the chart, this is listed as the asset
        name and metric name (i.e. BTC: Price or BTC: UDPI Short) followed by [m1…]. The ‘m’ stands for “metric” and the
        number corresponds to metric number, which will be used within the formula entry form.</Paragraph>

      <Paragraph>Clicking the [m1…] button will allow you to replace or remove the metric.</Paragraph>

      <Paragraph>Formula (f1…): The formulas will also be displayed in the top bar of the chart, these are distinguished
        from metrics by the [f1…] label. </Paragraph>

      <Paragraph>Clicking the [f1…] button will allow you to remove or rename the formula. The default, ‘Formula 1…’,
        can be renamed in order to quickly organize the formulas for faster analysis. </Paragraph>

      <br/><br/>

      <Title level={4}>Formula Bar</Title>

      <Paragraph>You can combine any metrics or formulas you have added to the chart easily within the formula entry
        form, without the need for coding knowledge.</Paragraph>

      <img className="formulaImg" src={formulaImg} alt={''} />

      <br/><br/>

      <Paragraph> Suppose you had the following metrics loaded within the chart:</Paragraph>

      <img className="metricsImg" src={metrics} alt={''} />

      <Paragraph>
        A very simple example of a formula you could create, would be an investigation of the percentage change of
        Ethereum, over some number of days. In order to do this simply click: </Paragraph>

      <Paragraph> <img className="metricsImg" src={percentage} alt={''} /> <br/> this will load an example
        formula:</Paragraph>

      <img className="formulaImg" src={percentagechange} alt={''} />

      <Paragraph>
        The format is: Operator (metric, number of days), so in the example the operator is: <b>‘percentage change’</b>,
        the metric is <b>m1</b> (remember, from above - m1 = (BTC: Price) and m2 =(ETH: Price)) and the number of days
        is set to 7, by default (you can change this, as we will now demonstrate).</Paragraph>

      <Paragraph>
        Since we want to see the percentage change of Ethereum, we will change the formula from percentage_change(m1,7)
        to percentage_change(m2,7), we can also adjust the length of time by changing the '7' to whatever we would like,
        let’s change it to '30', and then hit “Evaluate and draw”.</Paragraph>
      <br/>

      <img className="formulaImg" src={metricschange} alt={''} />

      <br/><br/>

      <img className="percentage-days" src={percentageDays} alt={''} />

      <br/><br/>

      <Paragraph>
        Instead of clicking:<br/><img className="metricsImg" src={percentage} alt={''} /> <br/> You can also simply type
        the operator, metric code, and date length into the formula bar.
      </Paragraph>

      <Paragraph>The formula bar will also allow you to use any mathematical operator on metrics or formulas. Currently
        +, -, /, * are supported. </Paragraph>

      <br/>
    </div>
  )
};

