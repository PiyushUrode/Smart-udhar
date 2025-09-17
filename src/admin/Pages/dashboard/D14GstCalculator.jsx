import React, { useState } from 'react';
import '../../Styles/Calculator.css';
import { FaMicrophone, FaCrown, FaRegFileAlt, FaClock, FaCog } from 'react-icons/fa';

const D14GstCalculator = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('0');
  const [gstMode, setGstMode] = useState('Including GST');

  const gstRates = [0, 5, 12, 18, 28];

  const handleButtonClick = (val) => {
    if (val === 'AC') {
      setInputValue('');
      setOutputValue('0');
    } else if (val === '=') {
      try {
        const result = eval(inputValue);
        setOutputValue(result.toFixed(2));
      } catch {
        setOutputValue('Error');
      }
    } else if (val === '%') {
      try {
        const result = eval(inputValue) / 100;
        setOutputValue(result.toFixed(2));
      } catch {
        setOutputValue('Error');
      }
    } else {
      setInputValue((prev) => prev + val);
    }
  };

  const applyGst = (rate, type = 'add') => {
    try {
      const evalResult = eval(inputValue || '0');
      let updated = 0;
      if (type === 'add') {
        updated = evalResult + (evalResult * rate) / 100;
      } else {
        updated = evalResult - (evalResult * rate) / 100;
      }
      setOutputValue(updated.toFixed(2));
    } catch {
      setOutputValue('Error');
    }
  };

  return (
    <div className="gst-container">
      <h3 className="title">GST Calculator</h3>

      <select value={gstMode} onChange={(e) => setGstMode(e.target.value)}>
        <option>Including GST</option>
        <option>Excluding GST</option>
      </select>

      <div className="display-box">
        <div className="input-display">{inputValue || '0'}</div>
        <div className="output-display">= {outputValue}</div>
      </div>

      <div className="gst-rate-buttons ">
        {gstRates.map((r) => (
          <button key={`add-${r}`} onClick={() => applyGst(r, 'add')}>+{r}%</button>
        ))}
      </div>
      <div className="gst-rate-buttons">
        {gstRates.map((r) => (
          <button key={`sub-${r}`} onClick={() => applyGst(r, 'sub')}>-{r}%</button>
        ))}
      </div>

      <div className="calc-grid">
        {['AC', '%', '.', <FaMicrophone style={{ color: '#33ACAB' }} />].map((v, i) => (
          <button key={i} onClick={() => handleButtonClick(typeof v === 'string' ? v : '')}>{v}</button>
        ))}
        {[7, 8, 9, <FaCrown />].map((v, i) => (
          <button key={i} onClick={() => handleButtonClick(typeof v === 'number' ? String(v) : '')}>{v}</button>
        ))}
        {[4, 5, 6, <FaRegFileAlt />].map((v, i) => (
          <button key={i} onClick={() => handleButtonClick(typeof v === 'number' ? String(v) : '')}>{v}</button>
        ))}
        {[1, 2, 3, <FaClock />].map((v, i) => (
          <button key={i} onClick={() => handleButtonClick(typeof v === 'number' ? String(v) : '')}>{v}</button>
        ))}
        {[0, '00', '=', <FaCog />].map((v, i) => (
          <button key={i} onClick={() => handleButtonClick(typeof v === 'string' ? v : '')}>{v}</button>
        ))}
      </div>

      <div className="footer-buttons">
        <button className="clear-btn" onClick={() => handleButtonClick('AC')}>Clear</button>
        <button className="add-btn">Add Sale</button>
      </div>
    </div>
  );
};

export default D14GstCalculator;
