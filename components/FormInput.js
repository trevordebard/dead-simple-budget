import { ErrorMessage } from 'react-hook-form';

const FormInput = ({ register, name, errors, required = false, ...rest }) => (
  <>
    <input name={name} ref={register({ required: required && 'Required' })} {...rest} />
    {errors && errors[name] && (
      <ErrorMessage errors={errors} name={name}>
        {({ message }) => <p style={{ color: 'red' }}>{message}</p>}
      </ErrorMessage>
    )}
  </>
);

const FormSelect = ({ children, register, name, errors, required = false, ...rest }) => (
  <>
    <select name={name} ref={register({ required: required && 'Required' })} {...rest}>
      {children}
    </select>
    {errors && errors[name] && (
      <ErrorMessage errors={errors} name={name}>
        {({ message }) => <p style={{ color: 'red' }}>{message}</p>}
      </ErrorMessage>
    )}
  </>
);

export default FormInput;
export { FormSelect };
