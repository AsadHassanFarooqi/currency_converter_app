import React, { useEffect, useState } from "react";
import Header from "./components/header/Header";
import CurrencyRow from "./components/currency-row/CurrencyRow";
import "./App.css";

const BASE_URL = "https://api.apilayer.com/exchangerates_data";

const API_KEY = "GiM1deIePxo5CV65Y876eO2SxNJm8xXa";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(`${BASE_URL}/latest?apikey=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      });
  }, []);

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  };

  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };

  useEffect(() => {
    if(toCurrency != null && fromCurrency != null) {
      fetch(`${BASE_URL}/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.result));
    }
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="container">
      <Header />
      <div className="wrapper">
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrecny={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          amount={fromAmount}
          onChangeAmount={handleFromAmountChange}
        />
        <p className="equals">=</p>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrecny={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          amount={toAmount}
          onChangeAmount={handleToAmountChange}
        />
      </div>
    </div>
  );
}

export default App;
