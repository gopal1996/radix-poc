import React from "react";

import "./container.css";

type ContainerProps = {
  children: React.ReactNode;
  title: string;
};

export const Container = ({ children, title }: ContainerProps) => {
  return (
    <div className="container">
      <p className="title">{title}</p>
      <div className="children">{children}</div>
    </div>
  );
};
