import { ErrorMessage } from 'react-hook-form';

const Input = ({ register, name, errors, ...rest }) => (
  <>
    <input name={name} ref={register} {...rest} />
    {errors && (
      <ErrorMessage errors={errors} name={name}>
        {({ message }) => <span style={{ color: 'red' }}>{message} </span>}
      </ErrorMessage>
    )}
  </>
);
export default Input;
