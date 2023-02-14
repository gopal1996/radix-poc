import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import "./style.css";
import { currencyMap } from "./currencyMap";

type CurrencyProps = {
  value: string;
  onChange: (value: string) => void;
  currencyTypes: string[];
};

export const Currency = ({ currencyTypes, value = "123", onChange }: CurrencyProps) => {
  let [currencyValue, setCurrencyValue] = useState(value);
  let [selectedCurrency, setSelectedCurrency] = useState(currencyTypes[0]);

  const onCurrencySymbolChange = (value: string) => {
    setSelectedCurrency(value);
    let newValue = currencyMap[value] + " " + currencyValue;
    onChange(newValue || "");
  };

  return (
    <div className="currency-container">
      <div className="number">
        <input
          type="text"
          name="currency"
          value={currencyValue}
          onChange={(event) => {
            let value = event.target.value;
            setCurrencyValue(value);
            let newValue = currencyMap[selectedCurrency] + " " + value;
            onChange(newValue || "");
          }}
          id="currency"
          className="CurrencyInput"
          placeholder="Currency"
        />
      </div>
      <div className="dropdown">
        <Select.Root defaultValue={selectedCurrency} onValueChange={onCurrencySymbolChange}>
          <Select.Trigger aria-label="Currency" className="SelectTrigger">
            <Select.Value />
            <Select.Icon className="SelectIcon">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="SelectContent">
              <Select.ScrollUpButton className="SelectScrollButton">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="SelectViewPort">
                <Select.Group>
                  {currencyTypes.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton className="SelectScrollButton">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
};

type SelectItemProps = {
  children: React.ReactNode;
  className?: string;
  value: string;
};

const SelectItem = React.forwardRef(
  ({ children, className, value, ...props }: SelectItemProps, forwardedRef) => {
    return (
      <Select.Item
        className={classnames("SelectItem", className)}
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);
