import {Button, Col, Input, Row, Typography} from "antd";

import {useEffect, useRef, useState} from "react";

import {FormulaButtons} from "./FormulaButtons";

export const FormulaBar = ({
  metricData,
  setMetricData,
  currentIndex,
  setChartIsSaved,
  tooltipOnOff
}:any) => {
  const [advancedFormula, setAdvancedFormula] = useState("");
  const formulaInput = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  function advancedFormulaChanged(e: any) {
    setAdvancedFormula(e.target.value);
    setCursorPosition(formulaInput.current.input.selectionStart);
  }

  const evaluateFormula = () => {
    metricData[currentIndex].formulaInput = advancedFormula;
    metricData[currentIndex].refreshFormula = true;
    setMetricData([...metricData]);
    setChartIsSaved(false);
  };

  useEffect(() => {
    let metricDatum = metricData[currentIndex];
    if (!metricDatum) return;
    let formula = metricDatum.formulaInput;
    setAdvancedFormula(formula);
  }, [currentIndex, metricData.length]);

  return <>
    <Row
      className="input-scroll"
      style={{
        borderTop: "1px solid rgb(255 255 255 / 35%)",
        overflowX: "auto",
        display: "flex",
        whiteSpace: "nowrap"
      }}>
      <Col className="widthCalculate">
        <Input
          className="formula-input1"
          type="text"
          value={advancedFormula}
          placeholder="sma(m1,7)*100"
          spellCheck={false}
          onChange={advancedFormulaChanged}
          onClick={advancedFormulaChanged}
          onKeyUp={advancedFormulaChanged}
          ref={formulaInput} />
      </Col>

      <Col className="evaluateBtnWrapper">
        <Button
          className="evaldrawButton"
          style={{ margin: "0px 0px 0px 20px", color: '#000' }}
          onClick={() => evaluateFormula()}>
          Evaluate and draw
        </Button>
      </Col>
    </Row>

    {metricData[currentIndex]?.hasError &&
      <Row
        style={{  color: "rgb(249 151 127)", fontSize: "0.75rem", marginTop: "4px" }}>
        There was an error processing the formula. Please check the syntax.
      </Row>
    }

    <Row
      style={{
        color: "white",
        margin: "5px",
        display: "border box",
        scrollBehavior: "auto",
        borderBottom: "1px solid #cecece",
        marginBottom: "1rem",
        width: "100%"
      }}>
      <Col
        style={{
          display: "flex",
          alignItems: "center"
        }}>
        <Typography
          className="typoWidthIncrease"
          style={{
            color: "white",
            textAlign: "left",
            flex: "auto"
          }}>
          Available functions:
        </Typography>
      </Col>

      <FormulaButtons
        tooltipOnOff={tooltipOnOff}
        setAdvancedFormula={setAdvancedFormula}
        advancedFormula={advancedFormula}
        formulaInput={formulaInput}
        cursorPosition={cursorPosition}
        setCursorPosition={setCursorPosition} />
    </Row>
  </>
}
