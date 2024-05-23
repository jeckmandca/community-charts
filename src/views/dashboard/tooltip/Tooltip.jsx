import {Tooltip} from "antd";

import React from "react";

import info from '../../../images/icons/info.svg';
import "./Tooltip.css";

export default function TooltipWrapper({ children, text, ...rest }) {
  return (
    <div className="tooltip-box">
      <Tooltip placement="bottom" title={text}>
        <img className="imgHover" src={info} style={{ width: 19, height: 19}} alt={''} />
      </Tooltip>

      <div {...rest}>
        {children}
      </div>
    </div>
  );
}
