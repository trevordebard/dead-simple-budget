import React, { createContext, ReactNode, useContext } from 'react';

// const food = ['burger', 'pizza', 'gumbo', 'jambalaya', 'hotdogs'];
// function ExampleMultiSelectUsage() {
//   const [selectedFood, setSelectedFood] = useState([]);
//   const { data: transactions } = useTransactions();
//   const handleItemSelected = itemSelected => {
//     const newArr = addOrRemoveFromArray(selectedFood, itemSelected);
//     setSelectedFood(newArr);
//   };

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
//       <MultiSelectList onItemSelected={item => handleItemSelected(item)}>
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
  onItemSelected?: (value: string) => void;
}

const defaultContext: iMultiSelectListContext = {
  onItemSelected: () => null,
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
  onItemSelected?: (value: string) => void;
}

export function MultiSelectList({ children, onItemSelected = null }: iMultiSelectListProps) {
  return <MultiSelectListContext.Provider value={{ onItemSelected }}>{children}</MultiSelectListContext.Provider>;
}

interface iListItem {
  children: ReactNode;
  value: string; // This value is what will be passed back up to the List component on click
}

export function ListItem({ children, value }: iListItem) {
  const { onItemSelected } = useListContext();

  return (
    <div
      onClick={() => {
        onItemSelected(value);
      }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );
}
