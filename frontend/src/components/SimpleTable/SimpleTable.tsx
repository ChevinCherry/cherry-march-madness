import React from "react";
import { Box } from "@mui/material";
import SimpleTableHeader from "./SimpleTableHeader";
import SimpleTableItem from "./SimpleTableItem";

export interface SimpleTableColumnFormat<
  T extends string,
  U extends Record<T, any>,
> {
  id: T;
  header: React.ReactNode;
  display: (value: U[T]) => React.ReactNode;
  width: string;
}

export interface SimpleTableProps<T extends string, U extends Record<T, any>> {
  format: SimpleTableColumnFormat<T, U>[];
  items: U[];
}

const SimpleTable = <T extends string, U extends Record<T, any>>(
  props: SimpleTableProps<T, U>
) => {
  const { format, items } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        border: "1px solid rgb(212, 212, 212)",
        borderRadius: "0.5rem",
      }}
    >
      <SimpleTableHeader format={format} />
      <Box
        sx={{
          overflowY: "scroll",
          scrollbarGutter: "stable",
          flex: 1,
          minHeight: 0,
        }}
      >
        {items.map((item, index) => (
          <SimpleTableItem
            key={
              "key" in item && typeof item.key === "string"
                ? item.key
                : undefined
            }
            format={format}
            item={item}
            lastItem={index === items.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SimpleTable;
