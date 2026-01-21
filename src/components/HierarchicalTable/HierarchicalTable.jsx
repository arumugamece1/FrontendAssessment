import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { initialData } from "@/data/initialData";
import {
  cloneData,
  findRowById,
  updateParentSubtotals,
  distributeToChildren,
  calculateGrandTotal,
  calculateOriginalGrandTotal,
  calculateVariance,
} from "@/utils/hierarchyUtils";
import TableRowComponent from "./TableRow";

const HierarchicalTable = () => {
  const [data, setData] = useState(initialData);

  const handleAllocatePercentage = useCallback((id, percentage) => {
    setData((prevData) => {
      let newData = cloneData(prevData);
      const row = findRowById(newData, id);

      if (!row) return prevData;

      const newValue = row.value * (1 + percentage / 100);
      const hasChildren = row.children && row.children.length > 0;

      if (hasChildren) {
        const updatedRow = distributeToChildren(row, newValue);
        Object.assign(row, updatedRow);
      } else {
        row.value = newValue;
      }

      newData = updateParentSubtotals(newData);
      return newData;
    });
  }, []);

  const handleAllocateValue = useCallback((id, value) => {
    setData((prevData) => {
      let newData = cloneData(prevData);
      const row = findRowById(newData, id);

      if (!row) return prevData;

      const hasChildren = row.children && row.children.length > 0;

      if (hasChildren) {
        const updatedRow = distributeToChildren(row, value);
        Object.assign(row, updatedRow);
      } else {
        row.value = value;
      }

      newData = updateParentSubtotals(newData);
      return newData;
    });
  }, []);

  const grandTotal = calculateGrandTotal(data);
  const originalGrandTotal = calculateOriginalGrandTotal(data);
  const grandTotalVariance = calculateVariance(grandTotal, originalGrandTotal);

  const getVarianceColor = (variance) => {
    if (variance > 0) return "#4caf50";
    if (variance < 0) return "#f44336";
    return "#757575";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#1976d2",
          textAlign: "center",
        }}
      >
        Hierarchical Data Table
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#1976d2",
              }}
            >
              <TableCell sx={{ color: "white", fontWeight: 600, fontSize: "1rem" }}>
                Label
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontWeight: 600, fontSize: "1rem" }}
              >
                Value
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600, fontSize: "1rem" }}>
                Input
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600, fontSize: "1rem" }}>
                Allocation %
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600, fontSize: "1rem" }}>
                Allocation Val
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontWeight: 600, fontSize: "1rem" }}
              >
                Variance %
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRowComponent
                key={row.id}
                row={row}
                level={0}
                onAllocatePercentage={handleAllocatePercentage}
                onAllocateValue={handleAllocateValue}
              />
            ))}
            <TableRow
              sx={{
                backgroundColor: "#e3f2fd",
                borderTop: "2px solid #1976d2",
              }}
            >
              <TableCell>
                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  Grand Total
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                  }}
                >
                  {grandTotal.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell align="right">
                <Typography
                  sx={{
                    color: getVarianceColor(grandTotalVariance),
                    fontWeight: 700,
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                  }}
                >
                  {grandTotalVariance >= 0 ? "+" : ""}
                  {grandTotalVariance.toFixed(2)}%
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HierarchicalTable;
