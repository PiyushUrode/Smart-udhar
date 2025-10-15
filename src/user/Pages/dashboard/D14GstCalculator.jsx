import React, { useState, useEffect } from 'react';
import { IoBackspaceOutline } from 'react-icons/io5';

// Single-file React component styled with Tailwind CSS
// Tailwind must be configured in the host project.

const STORAGE_KEY = 'gst_calc_history_v1';

export default function D14GstCalculator() {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('0');
  const [gstDetails, setGstDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [history, setHistory] = useState([]);

  const gstRates = [40, 5, 12, 18, 28];
  const operatorMap = { '÷': '/', '×': '*', '✕': '*', '+': '+', '-': '-' };

  const safeEval = (expr) => {
    const replaced = expr.replace(/÷|×|✕/g, (match) => operatorMap[match]);
    try {
      // eslint-disable-next-line no-new-func
      return Function(`return ${replaced}`)();
    } catch {
      return 'Error';
    }
  };

  // ----- History (localStorage) -----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load history', e);
    }
  }, []);

  const persistHistory = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save history', e);
    }
  };

  const pushHistory = (record) => {
    const next = [record, ...history].slice(0, 10); // keep last 10
    setHistory(next);
    persistHistory(next);
  };

  const removeHistoryAt = (index) => {
    const next = history.filter((_, i) => i !== index);
    setHistory(next);
    persistHistory(next);
  };

  const clearHistory = () => {
    setHistory([]);
    persistHistory([]);
  };

  // creates a standardized record
  const makeRecord = ({ type = 'calc', input = '', output = '', details = null }) => ({
    id: Date.now(),
    type,
    input,
    output,
    details,
    ts: new Date().toISOString(),
  });

  // ----- Button handlers -----
  const handleButtonClick = (val) => {
    if (val === 'AC') {
      setInputValue('');
      setOutputValue('0');
      setGstDetails(null);
      setShowPopup(false);
    } else if (val === '=') {
      const result = safeEval(inputValue);
      const formatted = isNaN(result) ? 'Error' : Number(result).toFixed(2);
      setOutputValue(formatted);
      setGstDetails(null);
      setShowPopup(false);

      pushHistory(makeRecord({ type: 'calc', input: inputValue || '0', output: String(formatted) }));
    } else if (val === 'back') {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (val === '%') {
      const result = safeEval(inputValue) / 100;
      const formatted = isNaN(result) ? 'Error' : Number(result).toFixed(2);
      setOutputValue(formatted);
      setGstDetails(null);
      setShowPopup(false);

      pushHistory(makeRecord({ type: 'percent', input: inputValue || '0', output: String(formatted) }));
    } else {
      setInputValue((prev) => prev + val);
      setGstDetails(null);
      setShowPopup(false);
    }
  };

  const applyGst = (rate, type = 'add') => {
    let baseValue = safeEval(inputValue || '0');
    if (isNaN(baseValue)) baseValue = 0;

    let total = 0,
      base = 0,
      cgst = 0,
      sgst = 0;

    if (type === 'add') {
      base = baseValue;
      const gstAmount = (baseValue * rate) / 100;
      total = baseValue + gstAmount;
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
    } else {
      total = baseValue;
      base = (baseValue * 100) / (100 + rate);
      const gstAmount = total - base;
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
    }

    const formattedTotal = Number(total).toFixed(2);
    setOutputValue(formattedTotal);

    const details = {
      base: Number(base).toFixed(2),
      cgst: Number(cgst).toFixed(2),
      sgst: Number(sgst).toFixed(2),
      total: Number(total).toFixed(2),
      rate,
      type,
    };

    setGstDetails(details);
    setShowPopup(true);

    pushHistory(makeRecord({ type: `gst-${type}` , input: inputValue || '0', output: formattedTotal, details }));
  };

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (/[0-9.+\-*/]/.test(key)) {
        handleButtonClick(key === '*' ? '×' : key === '/' ? '÷' : key);
      } else if (key === 'Enter') {
        handleButtonClick('=');
      } else if (key === 'Backspace') {
        handleButtonClick('back');
      } else if (key === 'Escape') {
        handleButtonClick('AC');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, history]);

  const restoreFromHistory = (rec) => {
    setInputValue(rec.input || '');
    setOutputValue(rec.output || '0');
    setGstDetails(rec.details || null);
    setShowPopup(Boolean(rec.details));
  };

  const fmtTime = (iso) => {
    try {
      return new Date(iso).toLocaleString('en-IN', { hour12: false });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg text-gray-700 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold mb-3 text-left">GST Calculator</h3>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 text-right">
          <div className="text-xl font-medium">{inputValue || '0'}</div>
          <div className="text-base text-gray-600">= {outputValue}</div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-2">
          {gstRates.map((r) => (
            <button
              key={`add-${r}`}
              onClick={() => applyGst(r, 'add')}
              className="py-2 rounded-md bg-gray-100 hover:bg-blue-50 font-medium"
            >
              +{r}%
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {gstRates.map((r) => (
            <button
              key={`sub-${r}`}
              onClick={() => applyGst(r, 'sub')}
              className="py-2 rounded-md bg-gray-100 hover:bg-blue-50 font-medium"
            >
              -{r}%
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleButtonClick('AC')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-medium"
          >
            AC
          </button>

          <button
            onClick={() => handleButtonClick('%')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-medium"
          >
            %
          </button>

          <button
            onClick={() => handleButtonClick('÷')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-medium"
          >
            ÷
          </button>

          <button
            onClick={() => handleButtonClick('back')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
            aria-label="backspace"
          >
            <IoBackspaceOutline size={18} />
          </button>

          {[7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleButtonClick(String(n))}
              className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => handleButtonClick('×')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
          >
            ×
          </button>

          {[4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => handleButtonClick(String(n))}
              className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => handleButtonClick('-')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
          >
            -
          </button>

          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => handleButtonClick(String(n))}
              className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => handleButtonClick('+')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
          >
            +
          </button>

          <button
            onClick={() => handleButtonClick('0')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
          >
            0
          </button>

          <button
            onClick={() => handleButtonClick('00')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
          >
            00
          </button>

          <button
            onClick={() => handleButtonClick('.')}
            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-blue-50 font-medium"
          >
            .
          </button>

          <button
            onClick={() => handleButtonClick('=')}
            className="py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            =
          </button>
        </div>

        {/* Popup Modal */}
        {showPopup && gstDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-72 text-center shadow-xl">
              <h4 className="text-md font-semibold mb-2">GST Breakdown ({gstDetails.rate}%)</h4>
              <div className="text-left">
                <p className="mb-1">Base Price: ₹{gstDetails.base}</p>
                <p className="mb-1">CGST ({gstDetails.rate / 2}%): ₹{gstDetails.cgst}</p>
                <p className="mb-1">SGST ({gstDetails.rate / 2}%): ₹{gstDetails.sgst}</p>
                <p className="mt-2 font-semibold">Total: ₹{gstDetails.total}</p>
              </div>
              <button
                className="mt-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setShowPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Panel */}
      <aside className="bg-gray-50 p-4 rounded-lg shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">History</h4>
          <div className="flex gap-2">
            <button onClick={clearHistory} className="text-sm text-red-600 hover:underline">Clear</button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-sm text-gray-500">No history yet. Recent calculations will appear here (max 10).</div>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-auto pr-2">
            {history.map((rec, idx) => (
              <li key={rec.id} className="bg-white p-2 rounded-md border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="text-sm">
                    <div className="font-medium truncate">{rec.input} → {rec.output}</div>
                    {rec.details && (
                      <div className="text-xs text-gray-500">
                        {rec.details.type === 'add' || rec.details.type === 'sub' ? (
                          <span>GST {rec.details.rate}% — base ₹{rec.details.base}</span>
                        ) : null}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">{fmtTime(rec.ts)}</div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => restoreFromHistory(rec)}
                      className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => removeHistoryAt(idx)}
                      className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 text-xs text-gray-500">Stored locally (last 10). Restoring a record will populate inputs and show GST popup if available.</div>
      </aside>
    </div>
  );
}
