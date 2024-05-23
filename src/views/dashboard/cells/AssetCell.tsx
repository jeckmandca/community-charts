import React from "react";
import { Link } from "react-router-dom";

const styles = {
  imgStyle: {
    height: "1.25rem",
    marginRight: "8px"
  },
  textStyle: {
    color: "#fff",
    fontFamily: "Comfortaa,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
    fontSize: '16px',
    fontWeight: '800'
  }
}

interface PropTypes {
  text: any,
  data: any[]
}

const AssetCell: React.FC<PropTypes> = ({data}:any) => (
  <Link
    to="/risk"
    state={{ coinData: data }}
    style={{ display: "flex", alignItems: "center" }}>
      <img
        className="crypto-coin-icon"
        style={styles.imgStyle}
        src={data['image']}
        alt={''} />

      <span className="name-slogan">
        <a style={styles.textStyle}>{data['name']}</a>
        <p>{data['symbol'].toUpperCase()}</p>
      </span>
  </Link>
)

export default AssetCell;
