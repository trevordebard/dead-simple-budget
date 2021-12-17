import { useState } from "react";


export const EditableStackItem = ({ label, amount, id, dragControls = null }) => {
  const [prevAmount, setPrevAmount] = useState<string>(amount);
  const [inputAmount, setInputAmount] = useState(amount);
  // const handleRowClick = () => {
  //   if (budgetContext.stackInFocus === id) {
  //     budgetContext.setStackInFocus(null);
  //   } else {
  //     budgetContext.setStackInFocus(id);
  //   }
  // };
  // useEffect(() => {
  //   setInputAmount(centsToDollars(amount));
  // }, [amount, setInputAmount]);

  return (
    <div >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>{label} </p>
      </div>
      <input
        name={label}
        value={inputAmount}
        onChange={e => setInputAmount(e.target.value)}
        onFocus={e => {
          setPrevAmount(e.target.value.replace(/\,/g, ''));
        }}
        onClick={e => e.stopPropagation()} // Prevent ListRow from being selected
      // onBlur={e => {
      // let newAmt = e.target.value.replace(/\,/g, '');
      // if (prevAmount !== newAmt) {
      //   newAmt = evaluate(newAmt);
      //   setInputAmount(newAmt);
      //   updateStack({ id, label, amount: dollarsToCents(newAmt) });
      // }
      // }}
      />
    </div>
  );
};