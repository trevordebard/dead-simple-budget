import { ErrorMessage } from 'react-hook-form';
import { Input } from './styled';

const FormInput = ({ register, name, errors, required = false, ...rest }) => (
  <>
    <Input name={name} ref={register({ required: required && 'Required' })} {...rest} />
    {errors && errors[name] && (
      <ErrorMessage errors={errors} name={name}>
        {({ message }) => <p style={{ color: 'red' }}>{message}</p>}
      </ErrorMessage>
    )}
  </>
);

const FormSelect = ({ children, register, name, errors, required = false, ...rest }) => (
  <>
    <Input as="select" name={name} ref={register({ required: required && 'Required' })} {...rest}>
      {children}
    </Input>
    {errors && errors[name] && (
      <ErrorMessage errors={errors} name={name}>
        {({ message }) => <p style={{ color: 'red' }}>{message}</p>}
      </ErrorMessage>
    )}
  </>
);

export default FormInput;
export { FormSelect };
