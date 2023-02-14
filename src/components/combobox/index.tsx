import React from "react";
import { useMultipleSelection, useCombobox } from "downshift";
import * as Popover from "@radix-ui/react-popover";
import cx from "classnames";

import "./style.css";

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
          onFilter("");
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue);
          onFilter(newInputValue);
          break;

        default:
          break;
      }
    },
  });

  console.log("isOpen", isOpen);

  return (
    <React.Fragment>
      <Popover.Root className="MultiSelect" open={isOpen}>
        <Popover.Trigger asChild>
          <div className="SelectedItemList">
            {selectedItems.map(function renderSelectedItem(selectedItemForRender, index) {
              return (
                <span
                  className="SelectedItem"
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
              className="SearchBox"
              aria-label="toggle menu"
              // {...getToggleButtonProps()}
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content asChild>
            <ul className="ItemsList" {...getMenuProps()} tabIndex={-1}>
              {isOpen &&
                items.map((item, index) => (
                  <li
                    className={cx(
                      highlightedIndex === index && "HightlightedItem",
                      selectedItem === item && "Bold",
                      "Item"
                    )}
                    key={`${item.value}${index}`}
                    {...getItemProps({ item, index })}
                  >
                    <span>{item.title}</span>
                    <span className="text-sm text-gray-700">{item.author}</span>
                  </li>
                ))}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </React.Fragment>
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
  const [items, setItems] = React.useState(books);
  const [selectedItem, setSelectedItems] = React.useState([books[0], books[1]]);

  const onSelect = (selectedItems: Array<{ author: string; title: string }>) => {
    console.log("selected Items ", selectedItems);
    setSelectedItems(selectedItems);
  };

  function getFilteredBooks(inputValue: string) {
    console.log("filter is calling ", inputValue);
    const lowerCasedInputValue = inputValue.toLowerCase();

    const filteredBooks = books.filter(function filterBook(book) {
      return (
        // !selectedItem.filter((b) => b.title == book.title) &&
        book.title.toLowerCase().includes(lowerCasedInputValue) ||
        book.author.toLowerCase().includes(lowerCasedInputValue)
      );
    });
    setItems(filteredBooks);
  }

  return (
    <MultiSelect
      items={items}
      selectedItems={selectedItem}
      onSelect={onSelect}
      onFilter={getFilteredBooks}
    ></MultiSelect>
  );
}
