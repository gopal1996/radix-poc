import React from "react";
import { useMultipleSelection, useCombobox } from "downshift";

type MultiSelctProps = {
  items: Array<string | {}>;
  selectedItems: Array<string | {}>;
  onSelect: Function;
  onFilter?: Function;
  dir?: string;
};

export function MultiSelect(props: MultiSelctProps) {
  const { items, selectedItems, onSelect, onFilter = () => {} } = props;
  const [inputValue, setInputValue] = React.useState("");

  const { getSelectedItemProps, getDropdownProps, addSelectedItem, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            onSelect(newSelectedItems);
            break;
          default:
            break;
        }
      },
    });

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.title : "";
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && { isOpen: true, highlightedIndex: 0 }),
          };
        default:
          return changes;
      }
    },
    onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          onSelect([...selectedItems, newSelectedItem]);
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);
          break;

        default:
          break;
      }
    },
  });

  return (
    <div className="MultiSelect">
      <div className="MultiSelect SelectedItems">
        {selectedItems.map(function renderSelectedItem(selectedItemForRender, index) {
          return (
            <span
              className="bg-gray-100 rounded-md px-1 focus:bg-red-400"
              key={`selected-item-${index}`}
              {...getSelectedItemProps({
                selectedItem: selectedItemForRender,
                index,
              })}
            >
              {selectedItemForRender.title}
              <span
                className="px-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelectedItem(selectedItemForRender);
                }}
              >
                &#10005;
              </span>
            </span>
          );
        })}
        <input
          placeholder="Best book ever"
          className="w-full"
          aria-label="toggle menu"
          {...getToggleButtonProps()}
          {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
        />
      </div>
      {isOpen && (
        <ul
          className={`absolute w-inherit bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 ${
            !(isOpen && items.length) && "hidden"
          }`}
          {...getMenuProps()}
        >
          {isOpen &&
            items.map((item, index) => (
              <li
                className={cx(
                  highlightedIndex === index && "bg-blue-300",
                  selectedItem === item && "font-bold",
                  "py-2 px-3 shadow-sm flex flex-col"
                )}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <span>{item.title}</span>
                <span className="text-sm text-gray-700">{item.author}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export function MultiSelectExample() {
  const books = [
    { author: "Harper Lee", title: "To Kill a Mockingbird" },
    { author: "Lev Tolstoy", title: "War and Peace" },
    { author: "Fyodor Dostoyevsy", title: "The Idiot" },
    { author: "Oscar Wilde", title: "A Picture of Dorian Gray" },
    { author: "George Orwell", title: "1984" },
    { author: "Jane Austen", title: "Pride and Prejudice" },
    { author: "Marcus Aurelius", title: "Meditations" },
    { author: "Fyodor Dostoevsky", title: "The Brothers Karamazov" },
    { author: "Lev Tolstoy", title: "Anna Karenina" },
    { author: "Fyodor Dostoevsky", title: "Crime and Punishment" },
  ];

  const onSelect = (selectedItems: Array<{ author: string; title: string }>) => {
    console.log("selected Items ", selectedItems);
  };

  const onFilter = (searchText: string) => {
    console.log("on filter ", searchText);
  };

  return (
    <MultiSelect
      items={books}
      selectedItems={[books[0], books[1]]}
      onSelect={onSelect}
      onFilter={onFilter}
    ></MultiSelect>
  );
}
