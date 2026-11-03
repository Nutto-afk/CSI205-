'use client';

import { useState, useRef, useEffect } from "react";
import "./calculator.css";

interface CalcState {
  state: "first" | "operator" | "second";
  display: string;
  first: number;
  second: number;
  operator: string;
  isResult: boolean;
}

export default function Calculator() {
  const calcRef = useRef<CalcState>({
    state: "first",
    display: "0",
    first: 0,
    second: 0,
    operator: "",
    isResult: false,
  });

  const [display, setDisplay] = useState("0");

  const insertSeperator = (str: string, separator = ",", groupSize = 3) => {
    let integerPart = str;
    let isNegative = false;

    // if num value -
    if (integerPart.startsWith("-")) {
      isNegative = true;
      integerPart = integerPart.slice(1);
    }

    let decimalPart = "";
    if (integerPart.includes(".")) {
      const parts = integerPart.split(".");
      integerPart = parts[0];
      decimalPart = "." + parts[1];
    }

    let result = "";
    let counter = 0;

    for (let i = integerPart.length - 1; i >= 0; i--) {
      result = integerPart[i] + result;
      if (i !== 0 && counter++ % groupSize === groupSize - 1) {
        result = separator + result;
      }
    }

    if (isNegative) result = "-" + result;
    return result + decimalPart;
  };

  const calculate = (num1: number, op: string, num2: number): number | string => {
    switch (op) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return num2 !== 0 ? num1 / num2 : "Error";
      default:
        return num2;
    }
  };

  const NumberClick = (num: number | string) => {
    const current = calcRef.current;
    switch (current.state) {
      case "first":
        if (current.isResult) {
          current.display = String(num);
          current.isResult = false;
        } else if (current.display.length < 9) {
          if (current.display === "0") current.display = String(num);
          else current.display += String(num);
        }
        break;

      case "operator":
        current.display = String(num);
        current.state = "second";
        break;

      case "second":
        if (current.display.length < 9) {
          if (current.display === "0") current.display = String(num);
          else current.display += String(num);
        }
        break;
    }
    setDisplay(current.display);
  };

  const operandClick = (op: string) => {
    const current = calcRef.current;
    switch (current.state) {
      case "first":
        current.first = Number(current.display);
        current.operator = op;
        current.state = "operator";
        current.isResult = false;
        break;

      case "operator":
        current.operator = op;
        break;

      case "second":
        current.second = Number(current.display);
        const res = calculate(current.first, current.operator, current.second);
        current.display = String(res);
        current.first = Number(res);
        current.operator = op;
        current.state = "operator";
        break;
    }
    setDisplay(current.display);
  };

  const equalsClick = () => {
    const current = calcRef.current;
    switch (current.state) {
      case "first":
        break;

      case "operator":
        break;

      case "second":
        current.second = Number(current.display);
        const result = calculate(current.first, current.operator, current.second);
        current.display = String(result);
        current.first = Number(result);
        current.state = "first";
        current.isResult = true;
        break;
    }
    setDisplay(current.display);
  };

  const ceClick = () => {
    calcRef.current = {
      state: "first",
      display: "0",
      first: 0,
      second: 0,
      operator: "",
      isResult: false,
    };
    setDisplay("0");
  };

  const percentClick = () => {
    const current = calcRef.current;
    current.display = String(Number(current.display) / 100);
    setDisplay(current.display);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "=") equalsClick();
      else if (e.key === "Escape") ceClick();
      else if (e.key >= "0" && e.key <= "9") NumberClick(e.key);
      else if (e.key === "-") operandClick("-");
      else if (e.key === "+") operandClick("+");
      else if (e.key === "*") operandClick("*");
      else if (e.key === "/") operandClick("/");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="calc-page">
      <div className="calculator">
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <div className="display-container">
            <div id="display" className="display">
              {insertSeperator(display)}
            </div>
          </div>
          <div className="button-row">
            <button type="button" className="btn btn-mem" value="MC" disabled>
              MC
            </button>
            <button type="button" className="btn btn-mem" value="MR" disabled>
              MR
            </button>
            <button type="button" className="btn btn-mem" value="M+" disabled>
              M+
            </button>
            <button type="button" className="btn btn-mem" value="M-" disabled>
              M-
            </button>
            <button
              type="button"
              className="btn btn-func"
              value="CE"
              onClick={ceClick}
            >
              CE
            </button>
          </div>
          <div className="button-row">
            <button type="button" className="btn purple" onClick={() => NumberClick(7)}>
              7
            </button>
            <button type="button" className="btn purple" onClick={() => NumberClick(8)}>
              8
            </button>
            <button type="button" className="btn purple" onClick={() => NumberClick(9)}>
              9
            </button>
            <button type="button" className="btn green" onClick={() => operandClick('/')}>
              ÷
            </button>
            <button type="button" className="btn green" disabled>
              √
            </button>
          </div>
          <div className="button-row">
            <button type="button" className="btn purple" onClick={() => NumberClick(4)}>
              4
            </button>
            <button type="button" className="btn purple" onClick={() => NumberClick(5)}>
              5
            </button>
            <button type="button" className="btn purple" onClick={() => NumberClick(6)}>
              6
            </button>
            <button type="button" className="btn green" onClick={() => operandClick('*')}>
              ×
            </button>
            <button type="button" className="btn green" onClick={percentClick}>
              %
            </button>
          </div>
          <div className="button-row">
            <button type="button" className="btn purple" onClick={() => NumberClick(1)}>
              1
            </button>
            <button type="button" className="btn purple" onClick={() => NumberClick(2)}>
              2
            </button>
            <button type="button" className="btn purple" onClick={() => NumberClick(3)}>
              3
            </button>
            <button type="button" className="btn green" onClick={() => operandClick('-')}>
              -
            </button>
            <button type="button" className="btn green" disabled>
              1/x
            </button>
          </div>
          <div className="button-row">
            <button type="button" className="btn purple" onClick={() => NumberClick(0)}>
              0
            </button>
            <button type="button" className="btn purple" disabled>
              .
            </button>
            <button type="button" className="btn green" disabled>
              +/-
            </button>
            <button type="button" className="btn green" onClick={() => operandClick('+')}>
              +
            </button>
            <button type="button" className="btn btn-equal" onClick={equalsClick}>
              =
            </button>
          </div>
          <div className="student-info">68028322 ธนัตถ์ เผื่อนคง</div>
        </form>
      </div>
    </div>
  );
}