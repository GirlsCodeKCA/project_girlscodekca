import React from 'react';
import ReactLoading from 'react-loading';

const ButtonLoading = ({ className, disabled, loading, text, onClick=()=>{} }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type='submit'
      className={className}
    >
      {loading ? <ReactLoading type='spin' height={20} width={20} /> : text}
    </button>
  );
};

export default ButtonLoading;
