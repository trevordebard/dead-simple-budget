import { ErrorMessage } from 'react-hook-form';

const Input = ({ register, name, errors, required = false, component = 'input', ...rest }) => {
  const Component = component;
  return (
    <>
      <Component name={name} ref={register({ required: required && 'Required' })} {...rest} />
      {errors && errors[name] && (
        <ErrorMessage errors={errors} name={name}>
          {({ message }) => <p style={{ color: 'red' }}>{message}</p>}
        </ErrorMessage>
      )}
    </>
  );
};
export default Input;
