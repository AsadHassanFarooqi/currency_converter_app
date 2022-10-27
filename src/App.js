import React, { useEffect, useState } from "react";
import Header from "./components/header/Header";
import CurrencyRow from "./components/currency-row/CurrencyRow";
import Modal from "./components/modal/Modal";
import "./App.css";

const BASE_URL = "https://api.apilayer.com/exchangerates_data";

const API_KEY = "bY48lRq39eO1tUP9nVeZ4jA0T5RwX03k";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
        setIsLoading(false);
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
    if (toCurrency != null && fromCurrency != null) {
      setIsLoading(true);
      fetch(
        `${BASE_URL}/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}&apikey=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          setExchangeRate(data.result);
          setIsLoading(false);
        });
    }
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="container">
      <Header />
      {isLoading ? (
        <Modal />
      ) : (
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
      )}
      <h2 className="rates">Rates: <span>{exchangeRate}</span></h2>
    </div>
  );
}

export default App;
