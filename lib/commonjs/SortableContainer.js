"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _SortableItemWrapper = _interopRequireDefault(require("./SortableItemWrapper.js"));
var _SortableItem = _interopRequireDefault(require("./SortableItem.js"));
var _Config = require("./Config.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
 */const SortableContainer = ({
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
  } = (0, _Config.useSortableConfig)();

  // Shared values to track scrolling and item positions
  const scrollY = (0, _reactNativeReanimated.useSharedValue)(0); // Current scroll position
  const scrollView = (0, _reactNativeReanimated.useAnimatedRef)(); // Reference to the scroll view
  const positions = (0, _reactNativeReanimated.useSharedValue)(data.reduce((acc, item, index) => ({
    ...acc,
    [item.id]: index
  }), {}));

  // Scroll event handler to update scrollY shared value
  const onScroll = (0, _reactNativeReanimated.useAnimatedScrollHandler)({
    onScroll: ({
      contentOffset: {
        y
      }
    }) => {
      scrollY.value = y;
    }
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.ScrollView, {
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
    children: data.map((item, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_SortableItemWrapper.default, {
      id: item.id.toString(),
      positions: positions,
      editing: editing,
      draggable: item.draggable,
      reorderable: item.reorderable,
      data: data,
      onDragEnd: onDragEnd,
      scrollView: scrollView,
      scrollY: scrollY,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SortableItem.default, {
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
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(SortableContainer);
//# sourceMappingURL=SortableContainer.js.map