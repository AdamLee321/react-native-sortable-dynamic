"use strict";

import { useWindowDimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import React, { createContext, useContext } from 'react';

// Default configuration for the sortable grid/list (static fallback values)
import { jsx as _jsx } from "react/jsx-runtime";
const defaultConfig = {
  MARGIN: 10,
  // Default margin between items
  COL: 2,
  // Default number of columns
  SIZE: 100 // Temporary fallback size
};

// Create a Context for the sortable grid/list configuration
const ConfigContext = /*#__PURE__*/createContext(defaultConfig);

// Custom hook to use the sortable configuration context
export const useSortableConfig = () => useContext(ConfigContext);

// Configuration for animation settings
export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350
};

// Helper function to calculate the item's position based on its index
export const getPosition = (position, COL, SIZE) => {
  'worklet';

  return {
    x: position % COL === 0 ? 0 : SIZE * (position % COL),
    y: Math.floor(position / COL) * SIZE
  };
};

// Helper function to determine the new order of items during drag-and-drop
export const getOrder = (tx, ty, max, COL, SIZE) => {
  'worklet';

  const x = Math.round(tx / SIZE) * SIZE;
  const y = Math.round(ty / SIZE) * SIZE;
  const row = Math.max(y, 0) / SIZE;
  const col = Math.max(x, 0) / SIZE;
  return Math.min(row * COL + col, max);
};

/**
 * SortableConfigProvider component
 *
 * @param {Object} config - Custom configuration to override the default settings.
 * @param {number} config.MARGIN - Margin between items.
 * @param {number} config.COL - Number of columns in the grid.
 * @param {React.ReactNode} children - Child components that will use this configuration.
 */
const SortableConfigProvider = ({
  children,
  config = {}
}) => {
  const {
    width
  } = useWindowDimensions();
  const mergedConfig = {
    ...defaultConfig,
    ...config
  };
  mergedConfig.SIZE = width / mergedConfig.COL - mergedConfig.MARGIN;
  return /*#__PURE__*/_jsx(ConfigContext.Provider, {
    value: mergedConfig,
    children: children
  });
};
export default SortableConfigProvider;
//# sourceMappingURL=Config.js.map