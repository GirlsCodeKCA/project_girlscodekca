import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

const DropDown = ({ label, name, defaultValue = '', required, options }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const optionsSelect = [['', 'Seleccione una opción', true], ...Object.entries(options)];
  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);
  return (
    <label htmlFor={name} className='font-bold'>
      <span>{label}</span><br/>
      <select
        required={required}
        name={name}
        className='mt-2 rounded-lg p-2 cursor-auto outline-none text-blue-900 text-base w-64 border-2'
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        {optionsSelect.map((o) => {
          return (
            <option key={nanoid()} value={o[0]} disabled={o[2] ?? false}>
              {o[1]}
            </option>
          );
        })}
      </select>
    </label>
  );
};

export default DropDown;