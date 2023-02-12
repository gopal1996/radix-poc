import React from "react";
import { Container } from "./components/container";
import { Controller } from "./components/control";
import { Currency } from "./components/currency";
import { SliderComp } from "./components/slider";
import { MultiSelectExample } from "./components/combobox";

export const App = () => {
  const onCurrencyChange = (value: string) => {
    console.info("Cuurency::OnChange", value);
  };

  const currencyList = ["USD", "AFN", "AED", "ALK"];

  return (
    <div className="ui-wrapper">
      <div className="ui-components">
        <Container title="Slider">
          <SliderComp />
        </Container>
        <Container title="Currency">
          <Currency currencyTypes={currencyList} value="56" onChange={onCurrencyChange} />
        </Container>
      </div>
      <div className="ui-control">
        <Controller />
      </div>
      <div>
        <MultiSelectExample />
      </div>
    </div>
  );
};
