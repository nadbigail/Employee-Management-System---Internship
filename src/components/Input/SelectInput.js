import React, { useState } from 'react';

function SelectInput({ labelTitle, name, options, defaultValue, updateFormValue, updateType, containerStyle }) {
  const [value, setValue] = useState(defaultValue || "");

  const updateValue = (newValue) => {
    setValue(newValue);
    updateFormValue({ updateType, value: newValue });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className="label-text text-base-content">{labelTitle || 'Department'}</span>
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => updateValue(e.target.value)}
        className="w-full px-4 py-3 bg-gray-950 rounded-xl focus:ring-orange-400 border-0"
      >
        <option value="" disabled>Select Department</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.name}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;