import React from "react";

const CurrencyRow = ({ currencyOptions, selectedCurrecny, onChangeCurrency, amount, onChangeAmount }) => {
  return (
    <div className="currency__wrapper">
      <div className="field__wrapper">
        <label htmlFor="select">Currency</label>
        <select className="currency__select" id="select" value={selectedCurrecny} onChange={onChangeCurrency}>
          {currencyOptions.map((option, index) => (
            <option value={option} key={option+ index}>{option}</option>
          ))}
        </select>
      </div>
      <div className="field__wrapper">
        <label htmlFor="input">Amount</label>
        <input
          type="number"
          className="currency__input"
          placeholder="Please enter amount"
          id="input"
          value={amount}
          onChange={onChangeAmount}
          min='0'
        />
      </div>
    </div>
  );
};

export default CurrencyRow;
