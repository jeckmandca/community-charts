import React from "react";
import {StarOutlined} from '@ant-design/icons';

const styles = {
  imgStyle: {
    height: "1.25rem",
    marginRight: "5px"
  },
  textStyle: {
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: "10px"
  }
}

interface PropTypes {
  text: any
}

const MarketCapRankCell: React.FC<PropTypes> = ({text}:any) => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      maxWidth: '50px'
    }}>
    <StarOutlined style={{color: "#333", fontSize: '150%'}} />
    <a style={styles.textStyle}>{text}</a>
  </span>
)

export default MarketCapRankCell;

