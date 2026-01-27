import { Box } from "@mui/material";
import React from "react";
import { SimpleTableColumnFormat } from "./SimpleTable";

interface SimpleTableHeaderProps<
  T extends string,
  U extends Record<string, any>,
> {
  format: SimpleTableColumnFormat<T, U>[];
}

const SimpleTableHeader = <T extends string, U extends Record<string, any>>(
  props: SimpleTableHeaderProps<T, U>
) => {
  const { format } = props;
  const gridTemplateColumns = format.map((column) => column.width).join(" ");
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns,
        borderBottom: "1px solid rgb(200, 200, 200)",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);",
        overflowY: "hidden",
        scrollbarGutter: "stable",
      }}
    >
      {format.map((column) => (
        <Box sx={{ padding: "1rem", boxSizing: "border-box" }}>
          {column.header}
        </Box>
      ))}
    </Box>
  );
};

export default SimpleTableHeader;
