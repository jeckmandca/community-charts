import {InlineStylesModel} from "../../models/InlineStyleModel";

const styles: InlineStylesModel = {
  chartAndCoinContainer: {
    border: ".5px solid rgba(164,164,164,.35)",
    backgroundColor: "rgb(0,0,0)",
    height: "100%",
    borderRadius: "8px",
    paddingBottom: "1px",
    borderWidth: ".5px",
    maxHeight: "100%"
  },

  NewMetricContainer: {
    marginTop: "200px",
    height: "1vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#fff"
  },

  cryptoSelectorStyle: {
    color: "white",
    fontSize: "12px",
    width: "100%"
  },

  cryptoSelectorCol: {
    fontSize: "14px",
    marginBottom: "0em",
    fontWeight: 400,
    fontFamily:
      "Comfortaa,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif",
    textAlign: "center",
    color: "white"
  },

  datePickerRow: {
    display: "flex",
    flexFlow: "row wrap"
  },

  datePickerContainer: {
    marginLeft: "auto",
    display: "flex"
  },

  datePickerTitle: {
    marginTop: "auto",
    marginRight: "5px",
    cursor: "pointer"
  },

  logoStyle: {
    height: "17px",
    width: "17px"
  },

  RiskTopBar: {
    position: "relative"
  },

  dotContainer: {
    display: "inline-block",
    marginRight: "0.5rem",
    minWidth: "12px"
  },

  dot: {
    width: "100%",
    height: "100%",
    borderRadius: "10%",
    minHeight: "32px",
    minWidth: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  menuDot: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    minHeight: "15px",
    minWidth: "15px"
  },

  buttonAdd: {
    position: "absolute",
    top: "13px",
    right: "20px",
    padding: "10px 1px !important",
    borderRadius: "8px",
    color: "rgb(255,255,255)",
    backgroundColor: "rgb(20, 22, 22)",
    borderWidth: "1px",
    borderColor: "rgb(100, 100, 100)",
    fontFamily:
      "Comfortaa,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif",
    fontSize: "15px",
    fontWeight: 700,
    height: "auto"
  },

  buttonAdd2: {
    position: "absolute",
    top: "13px",
    right: "120px"
  },

  buttonAdd3: {
    color: "rgb(255,255,255)",
    backgroundColor: "rgb(20, 22, 22)",
    borderWidth: "1px",
    borderColor: "rgb(100, 100, 100)",
    fontSize: "15px",
    fontWeight: 700,
    fontFamily:
      "Comfortaa,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif",
    height: "auto",
    borderRadius: "8px"
  },

  loadingChart: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    color: "white",
    marginTop: "50px",
    marginBottom: "20px"
  }
}

export default styles
