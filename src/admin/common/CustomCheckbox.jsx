import React from 'react';

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="
        w-5 h-5 flex items-center justify-center 
        border-2 rounded-md text-white text-sm font-bold 
        transition-colors duration-200 
        border-gray-300 bg-white 
        peer-checked:bg-green-500 peer-checked:border-green-500
      ">
        {checked ? '✔' : ''}
      </span>
      {label}
    </label>
  );
};

export default CustomCheckbox;
