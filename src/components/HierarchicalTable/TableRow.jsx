import React, { useState } from "react";
import {
  TableRow as MuiTableRow,
  TableCell,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { calculateVariance } from "@/utils/hierarchyUtils";

const TableRowComponent = ({
  row,
  level,
  onAllocatePercentage,
  onAllocateValue,
}) => {
  const [inputValue, setInputValue] = useState("");

  const variance = calculateVariance(row.value, row.originalValue);
  const hasChildren = row.children && row.children.length > 0;

  const handleAllocatePercentage = () => {
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      onAllocatePercentage(row.id, percentage);
      setInputValue("");
    }
  };

  const handleAllocateValue = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onAllocateValue(row.id, value);
      setInputValue("");
    }
  };

  const getVarianceColor = () => {
    if (variance > 0) return "#4caf50";
    if (variance < 0) return "#f44336";
    return "#757575";
  };

  return (
    <>
      <MuiTableRow
        sx={{
          backgroundColor: hasChildren ? "#f5f5f5" : "white",
          "&:hover": {
            backgroundColor: hasChildren ? "#eeeeee" : "#fafafa",
          },
        }}
      >
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                paddingLeft: `${level * 24}px`,
                fontWeight: hasChildren ? 600 : 400,
                color: hasChildren ? "#1976d2" : "inherit",
              }}
            >
              {level > 0 && " "}
              {row.label}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="right">
          <Typography
            sx={{
              fontWeight: hasChildren ? 600 : 400,
              fontFamily: "monospace",
              fontSize: "0.95rem",
            }}
          >
            {row.value.toFixed(2)}
          </Typography>
        </TableCell>
        <TableCell>
          <TextField
            size="small"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            sx={{
              width: "120px",
              "& .MuiInputBase-input": {
                padding: "8px 12px",
              },
            }}
          />
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            size="small"
            onClick={handleAllocatePercentage}
            disabled={!inputValue}
            sx={{
              textTransform: "none",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Allocation %
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            size="small"
            onClick={handleAllocateValue}
            disabled={!inputValue}
            sx={{
              textTransform: "none",
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
                borderColor: "#1565c0",
              },
            }}
          >
            Allocation Val
          </Button>
        </TableCell>
        <TableCell align="right">
          <Typography
            sx={{
              color: getVarianceColor(),
              fontWeight: 500,
              fontFamily: "monospace",
            }}
          >
            {variance >= 0 ? "+" : ""}
            {variance.toFixed(2)}%
          </Typography>
        </TableCell>
      </MuiTableRow>
      {row.children?.map((child) => (
        <TableRowComponent
          key={child.id}
          row={child}
          level={level + 1}
          onAllocatePercentage={onAllocatePercentage}
          onAllocateValue={onAllocateValue}
        />
      ))}
    </>
  );
};

export default TableRowComponent;
