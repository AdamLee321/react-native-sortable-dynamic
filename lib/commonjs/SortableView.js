"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Config = _interopRequireDefault(require("./Config.js"));
var _SortableContainer = _interopRequireDefault(require("./SortableContainer.js"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * SortableView Component
 *
 * This component combines the configuration provider and the sortable container into a single component
 * to simplify usage. It provides an interface for managing the layout, editing mode, and the reordering
 * of items within a grid or list.
 *
 * Props:
 * @param {object} config - Configuration options such as `MARGIN` and `COL` for customizing the layout.
 * @param {Array} data - Array of data objects to render and reorder. Each object should have a unique `id`.
 * @param {boolean} editing - Whether the list is in editing mode, enabling drag-and-drop functionality.
 * @param {function} onDragEnd - Callback function called with the updated positions when the drag ends.
 * @param {function} renderItem - Function to render each item inside the sortable view. Receives an object containing `item` and `index`.
 * @param {function} onPress - Function to handle the press event on an item.
 * @param {function} onLongPress - Function to handle the long press event on an item.
 * @param {object} scrollContainerStyle - Custom style to apply to the scroll container.
 * @param {object} scrollContentContainerStyle - Custom style to apply to the scroll content container.
 * @param {object} itemStyle - Custom style to apply to each SortableItem.
 * @param {object} itemProps - Additional props to be passed to each SortableItem.
 * @param {object} scrollViewProps - Additional props to be passed to the ScrollView component.
 *
 * Usage:
 * <SortableView
 *   config={{ MARGIN: 10, COL: 2 }}
 *   data={dataArray}
 *   editing={isEditing}
 *   onDragEnd={handleDragEnd}
 *   renderItem={({ item }) => <YourCustomComponent item={item} />}
 *   onPress={handlePress}
 *   onLongPress={handleLongPress}
 *   itemStyle={{backgroundColor: 'blue'}}
 *   itemProps={{disabled: true}}
 * />
 */const SortableView = ({
  config,
  data,
  editing,
  onDragEnd,
  renderItem,
  onPress,
  onLongPress,
  scrollContainerStyle,
  scrollContentContainerStyle,
  itemStyle,
  itemProps,
  scrollViewProps = {}
}) => {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Config.default, {
    config: config,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SortableContainer.default, {
      editing: editing,
      data: data,
      onDragEnd: positions => {
        onDragEnd(positions);
      },
      renderItem: renderItem,
      onPress: onPress,
      onLongPress: onLongPress,
      scrollContainerStyle: scrollContainerStyle,
      scrollContentContainerStyle: scrollContentContainerStyle,
      style: itemStyle,
      ...itemProps,
      scrollViewProps: scrollViewProps
    })
  });
};
var _default = exports.default = SortableView;
//# sourceMappingURL=SortableView.js.map