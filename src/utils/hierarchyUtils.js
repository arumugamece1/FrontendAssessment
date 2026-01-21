// Calculate the sum of children values
export const calculateSubtotal = (children) => {
  if (!children || children.length === 0) return 0;
  return children.reduce((sum, child) => sum + child.value, 0);
};

// Calculate variance percentage
export const calculateVariance = (currentValue, originalValue) => {
  if (originalValue === 0) return currentValue === 0 ? 0 : 100;
  return ((currentValue - originalValue) / originalValue) * 100;
};

// Deep clone the data structure
export const cloneData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

// Find a row by ID in the hierarchy
export const findRowById = (data, id) => {
  for (const row of data) {
    if (row.id === id) return row;
    if (row.children) {
      const found = findRowById(row.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Find parent of a row by child ID
export const findParentById = (data, childId) => {
  for (const row of data) {
    if (row.children) {
      for (const child of row.children) {
        if (child.id === childId) return row;
      }
      const found = findParentById(row.children, childId);
      if (found) return found;
    }
  }
  return null;
};

// Update all parent subtotals recursively
export const updateParentSubtotals = (data) => {
  const updateNode = (node) => {
    if (node.children && node.children.length > 0) {
      const updatedChildren = node.children.map(updateNode);
      const subtotal = calculateSubtotal(updatedChildren);
      return {
        ...node,
        children: updatedChildren,
        value: subtotal,
      };
    }
    return node;
  };

  return data.map(updateNode);
};

// Distribute value to children based on their contribution
export const distributeToChildren = (row, newValue) => {
  if (!row.children || row.children.length === 0) {
    return { ...row, value: newValue };
  }

  const currentTotal = calculateSubtotal(row.children);
  
  if (currentTotal === 0) {
    // Equal distribution if current total is 0
    const equalShare = newValue / row.children.length;
    return {
      ...row,
      value: newValue,
      children: row.children.map(child => ({
        ...child,
        value: equalShare,
      })),
    };
  }

  // Distribute proportionally
  const updatedChildren = row.children.map(child => {
    const contribution = child.value / currentTotal;
    const newChildValue = contribution * newValue;
    return {
      ...child,
      value: Math.round(newChildValue * 10000) / 10000,
    };
  });

  return {
    ...row,
    value: newValue,
    children: updatedChildren,
  };
};

// Calculate grand total
export const calculateGrandTotal = (data) => {
  return data.reduce((sum, row) => sum + row.value, 0);
};

// Calculate original grand total
export const calculateOriginalGrandTotal = (data) => {
  return data.reduce((sum, row) => sum + row.originalValue, 0);
};
