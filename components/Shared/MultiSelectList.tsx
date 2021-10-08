import React, { createContext, ReactNode, useContext, useState } from 'react';

// const food = ['burger', 'pizza', 'gumbo', 'jambalaya', 'hotdogs'];
// function ExampleMultiSelectUsage() {
//   const [selectedFood, setSelectedFood] = useState([]);
//   const { data: transactions } = useTransactions();
//   if (!transactions) {
//     return null;
//   }
//   return (
//     <div>
//       <h5>Selected food:</h5>
//       {selectedFood.map(food => (
//         <p key={food}>{food}</p>
//       ))}
//       <h5>Options</h5>
//       <MultiSelectList onChange={items => setSelectedFood(items)}>
//         {food &&
//           food.map(item => (
//             <ListItem key={item} value={item}>
//               {item}
//             </ListItem>
//           ))}
//       </MultiSelectList>
//     </div>
//   );
// }

interface iMultiSelectListContext {
  selectedItems: string[];
  toggleItem: (item: string) => void;
  onChange?: (value: string) => void;
}

const defaultContext: iMultiSelectListContext = {
  selectedItems: [],
  toggleItem: () => null,
};

const MultiSelectListContext = createContext(defaultContext);
MultiSelectListContext.displayName = 'SelectorContext';

function useListContext() {
  return useContext(MultiSelectListContext);
}

interface iMultiSelectListProps {
  children: ReactNode;
  // Function to be called when a ListItem is selected
  // value will be a list of all selected ListItems
  onChange?: (value: string[]) => void;
}

export function MultiSelectList({ children, onChange = null }: iMultiSelectListProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    const index = selectedItems.indexOf(item);
    if (index === -1) {
      const newArray = [...selectedItems, item];
      setSelectedItems(newArray);
      if (onChange) {
        onChange(newArray);
      }
    } else {
      const filteredArray = selectedItems.filter(i => i !== item);
      setSelectedItems(filteredArray);
      if (onChange) {
        onChange(filteredArray);
      }
    }
  };

  return (
    <MultiSelectListContext.Provider value={{ selectedItems, toggleItem }}>{children}</MultiSelectListContext.Provider>
  );
}

interface iListItem {
  children: ReactNode;
  value: string; // This value is what will be passed back up to the List component on click
}

export function ListItem({ children, value }: iListItem) {
  const { toggleItem } = useListContext();

  return (
    <div
      onClick={() => {
        toggleItem(value);
      }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );
}
