"use strict";

import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useAnimatedReaction, withSpring, scrollTo, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { animationConfig, getOrder, getPosition } from "./Config.js";
import { useSortableConfig } from "./Config.js";

/**
 * SortableItemWrapper Component
 *
 * This component manages the gesture handling and animations for a draggable item in the sortable grid or list.
 * It uses the Reanimated 2 and Gesture Handler libraries to provide smooth drag-and-drop functionality.
 * The component calculates the item's position and handles reordering logic when the item is dragged.
 *
 * Props:
 * @param {React.ReactNode} children - The content to render inside the draggable item.
 * @param {object} positions - Shared value that contains the current positions of all items.
 * @param {number} id - Unique identifier for the item.
 * @param {function} onDragEnd - Callback function triggered when dragging ends, providing the updated item positions.
 * @param {object} scrollView - Reference to the scroll view for scrolling the list during drag.
 * @param {object} scrollY - Shared value representing the current scroll position.
 * @param {boolean} editing - Whether the grid or list is in editing mode, enabling drag-and-drop.
 * @param {boolean} draggable - Whether the item is draggable (default: true).
 * @param {Array} data - Array of items used to determine the reorderable state of items.
 *
 * Usage:
 * <SortableItemWrapper
 *   id={item.id}
 *   positions={positions}
 *   editing={isEditing}
 *   draggable={item.draggable}
 *   data={itemsArray}
 *   onDragEnd={handleDragEnd}
 *   scrollView={scrollView}
 *   scrollY={scrollY}
 * >
 *   <YourItemComponent />
 * </SortableItemWrapper>
 */
import { jsx as _jsx } from "react/jsx-runtime";
const SortableItemWrapper = ({
  children,
  positions,
  id,
  onDragEnd,
  scrollView,
  scrollY,
  editing,
  draggable = true,
  data
}) => {
  // Get safe area insets for accurate height calculation
  const inset = useSafeAreaInsets();
  const {
    height
  } = useWindowDimensions();
  const containerHeight = height - inset.top - inset.bottom;

  // Get the configuration for columns and size
  const {
    COL,
    SIZE,
    MARGIN
  } = useSortableConfig();

  // Calculate content height based on the number of items
  const contentHeight = Object.keys(positions.value).length / COL * SIZE;
  const isGestureActive = useSharedValue(false); // Whether the item is actively being dragged

  // Calculate initial position of the item
  const position = getPosition(positions.value[id], COL, SIZE);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Effect to reset isGestureActive when not in editing mode
  useEffect(() => {
    if (!editing) {
      isGestureActive.value = false;
    }
  }, [editing, isGestureActive]);

  // React to changes in the positions object
  useAnimatedReaction(() => positions.value[id],
  // Track changes to this item's position
  newOrder => {
    if (!isGestureActive.value) {
      const pos = getPosition(newOrder, COL, SIZE);
      translateX.value = withTiming(pos.x, animationConfig);
      translateY.value = withTiming(pos.y, animationConfig);
    }
  });
  const pan = Gesture.Pan().onStart(() => {
    if (editing && draggable) {
      // Store the starting position
      startX.value = translateX.value;
      startY.value = translateY.value;
      isGestureActive.value = false;
    }
  }).onUpdate(e => {
    if (editing && draggable) {
      // Calculate new position
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;

      // Calculate new order based on position
      const newOrder = getOrder(translateX.value, translateY.value, Object.keys(positions.value).length - 1, COL, SIZE);
      const oldOrder = positions.value[id];
      if (newOrder !== oldOrder) {
        // Find the item to swap positions with
        const idToSwap = Object.keys(positions.value).find(key => positions.value[key] === newOrder);

        // Only swap if the target item is reorderable
        const targetItem = data.find(tile => tile.id === Number(idToSwap));
        if (idToSwap && targetItem?.reorderable !== false) {
          const newPositions = {
            ...positions.value
          };
          newPositions[id] = newOrder;
          newPositions[idToSwap] = oldOrder;
          positions.value = newPositions;
        }
      }

      // Handle scrolling during drag
      const lowerBound = scrollY.value;
      const upperBound = lowerBound + containerHeight - SIZE;
      const maxScroll = contentHeight - containerHeight;
      const leftToScrollDown = maxScroll - scrollY.value;

      // Scroll up
      if (translateY.value < lowerBound) {
        const diff = Math.min(lowerBound - translateY.value, lowerBound);
        scrollY.value -= diff;
        scrollTo(scrollView, 0, scrollY.value, false);
        startY.value -= diff;
        translateY.value = startY.value + e.translationY;
      }
      // Scroll down
      if (translateY.value > upperBound) {
        const diff = Math.min(translateY.value - upperBound, leftToScrollDown);
        scrollY.value += diff;
        scrollTo(scrollView, 0, scrollY.value, false);
        startY.value += diff;
        translateY.value = startY.value + e.translationY;
      }
    }
  }).onEnd(() => {
    if (draggable) {
      // Snap the item back into its place when the drag ends
      const newPosition = getPosition(positions.value[id], COL, SIZE);
      translateX.value = withTiming(newPosition.x, animationConfig, () => {
        isGestureActive.value = false; // Set gesture to inactive
        runOnJS(onDragEnd)(positions.value); // Call onDragEnd on the JS thread
      });
      translateY.value = withTiming(newPosition.y, animationConfig);
    }
  });

  // Animated style for the item
  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0; // Bring the item to the front when active
    const scale = editing && isGestureActive.value ? withSpring(1.05) : withSpring(1); // Slightly enlarge the item when dragging
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIZE,
      height: SIZE,
      margin: MARGIN,
      zIndex,
      transform: [{
        translateX: translateX.value
      }, {
        translateY: translateY.value
      }, {
        scale
      }]
    };
  });
  return /*#__PURE__*/_jsx(Animated.View, {
    style: style,
    children: /*#__PURE__*/_jsx(GestureDetector, {
      gesture: pan,
      children: /*#__PURE__*/_jsx(Animated.View, {
        style: StyleSheet.absoluteFill,
        children: children
      })
    })
  });
};
export default SortableItemWrapper;
//# sourceMappingURL=SortableItemWrapper.js.map