import {Col, Tag, Tooltip} from "antd";

import formulaDefinitions from './FormulaDefinitions';

export const FormulaButtons = ({
  tooltipOnOff,
  setAdvancedFormula,
  advancedFormula,
  formulaInput,
  cursorPosition,
  setCursorPosition
}:any) => {
  let formulaElements:any = [];
  let formulas = Object.keys(formulaDefinitions);

  function updateAdvancedFormula(e: any) {
    e.preventDefault();

    let button = e.target.textContent.toLowerCase().trim();
    let formulaData = formulaDefinitions[button];
    if (!formulaData) return;

    let formula = formulaData.formula;
    let currentPos = cursorPosition;

    let formulaBeforeCursor = advancedFormula.slice(0, currentPos);
    let formulaAfterCursor = advancedFormula.slice(currentPos);
    let newFormula = formulaBeforeCursor + formula + formulaAfterCursor;

    let input = formulaInput.current.input;

    let newCursorPosition = currentPos + formula.length;
    setAdvancedFormula(newFormula);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursorPosition, newCursorPosition);
      setCursorPosition(newCursorPosition);
    }, 100);
  }

  for (let i = 0; i < formulas.length; i++) {
    let formula = formulas[i];
    let formulaData = formulaDefinitions[formula];
    formulaElements.push(
      <Col>
        <Tag
          style={{
            backgroundColor: "#b5afaf",
            cursor: "pointer",
            margin: "5px",
          }}
          onClick={updateAdvancedFormula}>
          {tooltipOnOff ?
            <Tooltip placement="bottom" title={formulaData.tooltip}>
              {formula}
            </Tooltip> :
            <>{formula}</>
          }
        </Tag>
      </Col>
    );

    // if not the last one, add comma
    if (i !== formulas.length - 1) {
      formulaElements.push(
        <Col>,</Col>
      );
    }
  }

  return formulaElements;
}
