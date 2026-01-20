import React from "react";

interface HTMLRootProps {
  title: string;
  children?: React.ReactNode;
}

const HTMLRoot = (props: HTMLRootProps) => {
  const { title, children } = props;
  return (
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
};

export default HTMLRoot;
