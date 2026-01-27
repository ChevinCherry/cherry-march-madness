import { Box } from "@mui/material";
import React from "react";
import { SimpleTableColumnFormat } from "./SimpleTable";

interface SimpleTableItemProps<T extends string, U extends Record<T, any>> {
  format: SimpleTableColumnFormat<T, U>[];
  item: U;
  lastItem?: boolean;
}

const SimpleTableItem = <T extends string, U extends Record<T, any>>(
  props: SimpleTableItemProps<T, U>
) => {
  const { format, item, lastItem } = props;
  const gridTemplateColumns = format.map((column) => column.width).join(" ");
  return (
    <Box sx={{ display: "grid", gridTemplateColumns }}>
      {format.map((column) => (
        <Box
          sx={{
            boxSizing: "border-box",
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "flexStart",
            padding: "1rem",
            borderBottom: !lastItem
              ? "1px solid rgb(212, 212, 212)"
              : undefined,
          }}
        >
          {column.display(item[column.id])}
        </Box>
      ))}
    </Box>
  );
};

export default SimpleTableItem;
