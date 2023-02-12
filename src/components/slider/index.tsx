import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import "./style.css";

export const SliderComp = () => {
  const [value, setValue] = useState(0);
  const handleChange = (value: number) => {
    console.info("Slider::Value", value);
    setValue(value);
  };
  return (
    <div className="wrapper">
      <Slider.Root
        className="SliderRoot"
        onValueChange={handleChange}
        defaultValue={[0]}
        max={100}
        step={1}
        aria-label="Volume"
      >
        <Slider.Track className="SliderTrack">
          <Slider.Range className="SliderRange" />
        </Slider.Track>
        <Slider.Thumb className="SliderThumb" />
      </Slider.Root>
      <div className="tooltip" style={{ left: `calc(${value}% - 10px)` }}>
        {value}
      </div>
    </div>
  );
};
