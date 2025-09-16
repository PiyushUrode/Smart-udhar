import React, { useState } from 'react';
import '../../Styles/Calculator.css';
import { FaCircle } from "react-icons/fa6";
import { FaMicrophone, FaCrown, FaRegFileAlt, FaClock, FaCog } from 'react-icons/fa';
import { IoBackspaceOutline } from "react-icons/io5";

const D14GstCalculator = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('0');
  const [gstMode, setGstMode] = useState('Including GST');

  const gstRates = [0, 5, 12, 18, 28];

  // Map UI symbols to real operators for safe calculation
  const operatorMap = {
    '÷': '/',
    '×': '*',
    '✕': '*',
    '+': '+',
    '-': '-'
  };

  // Sanitize and evaluate safely
  const safeEval = (expr) => {
    const replaced = expr.replace(/÷|×|✕/g, match => operatorMap[match]);
    try {
      // eslint-disable-next-line no-new-func
      return Function(`return ${replaced}`)();
    } catch {
      return 'Error';
    }
  };

  const handleButtonClick = (val) => {
    if (val === 'AC') {
      setInputValue('');
      setOutputValue('0');
    } else if (val === '=') {
      const result = safeEval(inputValue);
      setOutputValue(isNaN(result) ? 'Error' : result.toFixed(2));
    } else if (val === 'back') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (val === '%') {
      const result = safeEval(inputValue) / 100;
      setOutputValue(isNaN(result) ? 'Error' : result.toFixed(2));
    } else {
      setInputValue((prev) => prev + val);
    }
  };

  const applyGst = (rate, type = 'add') => {
    let baseValue = safeEval(inputValue || '0');
    if (isNaN(baseValue)) baseValue = 0;

    let updated = 0;
    if (gstMode === 'Including GST') {
      updated = type === 'add'
        ? baseValue + (baseValue * rate) / 100
        : baseValue - (baseValue * rate) / 100;
    } else {
      // Excluding GST calculation
      updated = type === 'add'
        ? (baseValue / (100 - rate)) * 100
        : (baseValue / (100 + rate)) * 100;
    }

    setOutputValue(updated.toFixed(2));
  };

  return (
    <div className="gst-container">
      <h3 className="title">GST Calculator</h3>

      <select
        value={gstMode}
        onChange={(e) => setGstMode(e.target.value)}
      >
        <option>Including GST</option>
        <option>Excluding GST</option>
      </select>

      <div className="display-box">
        <div className="input-display">{inputValue || '0'}</div>
        <div className="output-display">= {outputValue}</div>
      </div>

      {/* GST Add */}
      <div className="gst-rate-buttons">
        {gstRates.map((r) => (
          <button
            key={`add-${r}`}
            onClick={() => applyGst(r, 'add')}
          >
            +{r}%
          </button>
        ))}
      </div>

      {/* GST Subtract */}
      <div className="gst-rate-buttons">
        {gstRates.map((r) => (
          <button
            key={`sub-${r}`}
            onClick={() => applyGst(r, 'sub')}
          >
            -{r}%
          </button>
        ))}
      </div>

      {/* Calculator Buttons */}
      <div className="calc-grid">
        <button onClick={() => handleButtonClick('AC')} className="ac-btn">AC</button>
        <button onClick={() => handleButtonClick('%')}>%</button>
        <button onClick={() => handleButtonClick('÷')}>÷</button>
        <button onClick={() => handleButtonClick('back')}> <IoBackspaceOutline /></button>
        <button onClick={() => alert('Voice input coming soon!')}><FaMicrophone style={{ color: '#33ACAB' }} /></button>

        {[7, 8, 9].map((n) => (
          <button key={n} onClick={() => handleButtonClick(String(n))}>{n}</button>
        ))}
        <button onClick={() => handleButtonClick('×')}>×</button>
        <button onClick={() => alert('Premium feature!')}><FaCrown /></button>

        {[4, 5, 6].map((n) => (
          <button key={n} onClick={() => handleButtonClick(String(n))}>{n}</button>
        ))}
        <button onClick={() => handleButtonClick('-')}>-</button>
        <button onClick={() => alert('Saved invoices')}><FaRegFileAlt /></button>

        {[1, 2, 3].map((n) => (
          <button key={n} onClick={() => handleButtonClick(String(n))}>{n}</button>
        ))}
        <button onClick={() => handleButtonClick('+')}>+</button>
        <button onClick={() => alert('History feature')}><FaClock /></button>

        <button onClick={() => handleButtonClick('0')}>0</button>
        <button onClick={() => handleButtonClick('00')}>00</button>
        <button onClick={() => handleButtonClick('.')}>.</button>
        <button onClick={() => handleButtonClick('=')}>=</button>
        <button onClick={() => alert('Settings')}><FaCog /></button>
      </div>

      {/* Footer */}
      <div className="footer-buttons">
        <button className="clear-btn" onClick={() => handleButtonClick('AC')}>Clear</button>
        <button className="add-btn">Add Sale</button>
      </div>
    </div>
  );
};

export default D14GstCalculator;
