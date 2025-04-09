"use strict";

import React, { memo } from 'react';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import SortableItemWrapper from "./SortableItemWrapper.js";
import SortableItem from "./SortableItem.js";
import { useSortableConfig } from "./Config.js";

/**
 * SortableContainer Component
 *
 * This component renders a scrollable grid or list of items that can be reordered using drag-and-drop gestures.
 * It manages the layout and drag-and-drop logic for the items, providing the necessary props
 * to each child `SortableItemWrapper` component to enable dragging, scrolling, and reordering functionality.
 *
 * Props:
 * @param {Array} data - Array of data objects to render and reorder. Each object should have a unique `id`.
 * @param {boolean} editing - Whether the container is in editing mode, enabling drag-and-drop functionality.
 * @param {function} onDragEnd - Callback function called with the updated positions when a drag ends.
 * @param {function} renderItem - Function to render the content of each item inside the sortable container. Receives an object containing `item` and `index`.
 * @param {function} onPress - Function to handle the press event on a sortable item.
 * @param {function} onLongPress - Function to handle the long press event on a sortable item.
 * @param {object} scrollContainerStyle - Custom style to apply to the scroll container.
 * @param {object} scrollContentContainerStyle - Custom style to apply to the scroll content container.
 * @param {object} itemStyle - Custom style to apply to each SortableItem.
 * @param {...object} itemProps - Additional props to be passed to each SortableItem.
 * @param {object} scrollViewProps - Additional props to be passed to the ScrollView component.
 *
 * Usage:
 * <SortableContainer
 *   data={dataArray}
 *   editing={isEditing}
 *   onDragEnd={handleDragEnd}
 *   renderItem={({ item }) => <YourCustomComponent item={item} />}
 *   onPress={handlePress}
 *   onLongPress={handleLongPress}
 *   accessible={true}
 * />
 */
import { jsx as _jsx } from "react/jsx-runtime";
const SortableContainer = ({
  data,
  editing,
  onDragEnd,
  renderItem,
  onPress,
  onLongPress,
  scrollContainerStyle,
  scrollContentContainerStyle,
  itemStyle,
  scrollViewProps,
  ...itemProps
}) => {
  // Get the configuration for columns and size from context
  const {
    COL,
    SIZE
  } = useSortableConfig();

  // Shared values to track scrolling and item positions
  const scrollY = useSharedValue(0); // Current scroll position
  const scrollView = useAnimatedRef(); // Reference to the scroll view
  const positions = useSharedValue(data.reduce((acc, item, index) => ({
    ...acc,
    [item.id]: index
  }), {}));

  // Scroll event handler to update scrollY shared value
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({
      contentOffset: {
        y
      }
    }) => {
      scrollY.value = y;
    }
  });
  return /*#__PURE__*/_jsx(Animated.ScrollView, {
    onScroll: onScroll,
    ref: scrollView,
    contentContainerStyle: [{
      // Calculate the total height needed for the scroll view content
      height: Math.ceil(data.length / COL) * SIZE
    }, scrollContentContainerStyle],
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollEventThrottle: 16,
    style: scrollContainerStyle,
    ...scrollViewProps,
    children: data.map((item, index) => /*#__PURE__*/_jsx(SortableItemWrapper, {
      id: item.id.toString(),
      positions: positions,
      editing: editing,
      draggable: item.draggable,
      reorderable: item.reorderable,
      data: data,
      onDragEnd: onDragEnd,
      scrollView: scrollView,
      scrollY: scrollY,
      children: /*#__PURE__*/_jsx(SortableItem, {
        id: item.id.toString(),
        draggable: item.draggable,
        reorderable: item.reorderable,
        onPress: () => onPress && onPress(item),
        onLongPress: () => onLongPress && onLongPress(item),
        style: itemStyle,
        ...itemProps,
        children: renderItem({
          item: item,
          index
        })
      })
    }, item.id.toString()))
  });
};
export default /*#__PURE__*/memo(SortableContainer);
//# sourceMappingURL=SortableContainer.js.map