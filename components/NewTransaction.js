import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { useForm, ErrorMessage } from 'react-hook-form';
import CheckIcon from '@material-ui/icons/Check';
import { GET_TRANSACTIONS } from '../lib/queries/GET_TRANSACTIONS';
import useTransactions from '../hooks/useTransactions';

const NewTransaction = () => {
  const { register, handleSubmit, errors, reset, getValues } = useForm();
  const { addTransaction, stackLabels } = useTransactions();
  const onSubmit = () => {
    const data = getValues();
    const { description, amount, stack, date } = data;

    reset();
    addTransaction({
      variables: { record: { description, amount: parseFloat(amount), stack, date } },
      refetchQueries: { query: GET_TRANSACTIONS },
    });
  };
  return (
    <TableRow onSubmit={handleSubmit(onSubmit)}>
      <TableCell>
        <input
          name="description"
          defaultValue=""
          ref={register({ required: 'Required' })}
          style={{ width: '100%' }}
          type="text"
          placeholder="Description"
        />
      </TableCell>
      <TableCell>
        <input
          name="amount"
          ref={register({ required: 'Required' })}
          style={{ width: '100%' }}
          type="number"
          pattern="\d*"
          placeholder="$"
        />
      </TableCell>
      <TableCell>
        <select name="stack" ref={register({ required: true })}>
          {stackLabels &&
            stackLabels.map(label => (
              <option key={`${label}-${Date.now()}`} value={label}>
                {label}
              </option>
            ))}
          <ErrorMessage errors={errors} name="stack">
            {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
          </ErrorMessage>
        </select>
      </TableCell>
      <TableCell>
        <input id="date" type="date" name="date" ref={register} />
      </TableCell>
      <TableCell align="left">
        <CheckIcon onClick={e => onSubmit()} style={{ cursor: 'pointer' }} />
      </TableCell>
    </TableRow>
  );
};
export default NewTransaction;
